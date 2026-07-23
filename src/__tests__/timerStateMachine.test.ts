import { describe, it, expect, vi } from 'vitest';
import { TimerStateMachine } from '../lib/timerStateMachine';

describe('TimerStateMachine', () => {
  it('should initialize with default 30 second duration and idle state', () => {
    const timer = new TimerStateMachine();
    expect(timer.getState()).toBe('idle');
    expect(timer.getRemainingTime()).toBe(30);
    expect(timer.getDuration()).toBe(30);
    expect(timer.getActiveBuzzerId()).toBeNull();
  });

  it('should initialize with custom duration and trigger state change callback', () => {
    const onStateChange = vi.fn();
    const timer = new TimerStateMachine({ durationSeconds: 45, onStateChange });

    expect(timer.getDuration()).toBe(45);
    timer.start();
    expect(timer.getState()).toBe('running');
    expect(onStateChange).toHaveBeenCalledWith('running');
  });

  it('should decrement remaining time on tick and trigger onTick callback', () => {
    const onTick = vi.fn();
    const timer = new TimerStateMachine({ durationSeconds: 15, onTick });

    timer.start();
    const remaining = timer.tick(5);

    expect(remaining).toBe(10);
    expect(timer.getRemainingTime()).toBe(10);
    expect(onTick).toHaveBeenCalledWith(10);
  });

  it('should handle pause and resume correctly', () => {
    const timer = new TimerStateMachine({ durationSeconds: 20 });
    timer.start();

    timer.pause();
    expect(timer.getState()).toBe('paused');

    // Ticking while paused should not reduce remaining time
    timer.tick(2);
    expect(timer.getRemainingTime()).toBe(20);

    timer.resume();
    expect(timer.getState()).toBe('running');
    timer.tick(3);
    expect(timer.getRemainingTime()).toBe(17);
  });

  it('should freeze countdown on buzz and register player ID', () => {
    const timer = new TimerStateMachine({ durationSeconds: 30 });
    timer.start();
    timer.tick(10);

    const buzzed = timer.buzz('player_123');
    expect(buzzed).toBe(true);
    expect(timer.getState()).toBe('buzzed');
    expect(timer.getActiveBuzzerId()).toBe('player_123');

    // Ticking while buzzed should have no effect
    timer.tick(5);
    expect(timer.getRemainingTime()).toBe(20);

    timer.resumeFromBuzz();
    expect(timer.getState()).toBe('running');
    expect(timer.getActiveBuzzerId()).toBeNull();
  });

  it('should expire timer when remaining time reaches zero and trigger onExpire', () => {
    const onExpire = vi.fn();
    const timer = new TimerStateMachine({ durationSeconds: 10, onExpire });

    timer.start();
    timer.tick(10);

    expect(timer.getRemainingTime()).toBe(0);
    expect(timer.getState()).toBe('expired');
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('should reset timer duration and state', () => {
    const timer = new TimerStateMachine({ durationSeconds: 30 });
    timer.start();
    timer.tick(15);
    expect(timer.getRemainingTime()).toBe(15);

    timer.reset(60);
    expect(timer.getState()).toBe('idle');
    expect(timer.getDuration()).toBe(60);
    expect(timer.getRemainingTime()).toBe(60);
  });
});
