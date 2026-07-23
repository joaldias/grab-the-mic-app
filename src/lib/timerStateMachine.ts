export type TimerState =
  | 'idle'
  | 'ready'
  | 'running'
  | 'paused'
  | 'buzzed'
  | 'expired'
  | 'finished';

export interface TimerOptions {
  durationSeconds?: number;
  onTick?: (remaining: number) => void;
  onStateChange?: (state: TimerState) => void;
  onExpire?: () => void;
}

export class TimerStateMachine {
  private state: TimerState = 'idle';
  private durationSeconds: number;
  private remainingTime: number;
  private activeBuzzerId: string | null = null;
  private timerInterval: NodeJS.Timeout | null = null;

  private onTick?: (remaining: number) => void;
  private onStateChange?: (state: TimerState) => void;
  private onExpire?: () => void;

  constructor(options: TimerOptions = {}) {
    this.durationSeconds = options.durationSeconds ?? 30;
    this.remainingTime = this.durationSeconds;
    this.onTick = options.onTick;
    this.onStateChange = options.onStateChange;
    this.onExpire = options.onExpire;
  }

  public getState(): TimerState {
    return this.state;
  }

  public getRemainingTime(): number {
    return this.remainingTime;
  }

  public getDuration(): number {
    return this.durationSeconds;
  }

  public getActiveBuzzerId(): string | null {
    return this.activeBuzzerId;
  }

  private setState(newState: TimerState): void {
    if (this.state !== newState) {
      this.state = newState;
      if (this.onStateChange) {
        this.onStateChange(newState);
      }
    }
  }

  public start(): void {
    if (this.state === 'running') return;
    if (this.state === 'idle' || this.state === 'finished' || this.state === 'expired') {
      this.remainingTime = this.durationSeconds;
    }
    this.setState('running');
  }

  public pause(): void {
    if (this.state !== 'running') return;
    this.stopInterval();
    this.setState('paused');
  }

  public resume(): void {
    if (this.state !== 'paused') return;
    this.setState('running');
  }

  public buzz(playerId: string): boolean {
    if (this.state !== 'running') return false;
    this.activeBuzzerId = playerId;
    this.stopInterval();
    this.setState('buzzed');
    return true;
  }

  public resumeFromBuzz(): void {
    if (this.state !== 'buzzed') return;
    this.activeBuzzerId = null;
    this.setState('running');
  }

  public tick(seconds: number = 1): number {
    if (this.state !== 'running') return this.remainingTime;

    this.remainingTime = Math.max(0, this.remainingTime - seconds);

    if (this.onTick) {
      this.onTick(this.remainingTime);
    }

    if (this.remainingTime === 0) {
      this.stopInterval();
      this.setState('expired');
      if (this.onExpire) {
        this.onExpire();
      }
    }

    return this.remainingTime;
  }

  public reset(newDuration?: number): void {
    this.stopInterval();
    if (newDuration !== undefined && newDuration > 0) {
      this.durationSeconds = newDuration;
    }
    this.remainingTime = this.durationSeconds;
    this.activeBuzzerId = null;
    this.setState('idle');
  }

  public finish(): void {
    this.stopInterval();
    this.setState('finished');
  }

  private stopInterval(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
}
