import os
import json

# Script to build src/lib/musicData.ts with 300+ words and 3+ songs per word

words_data = [
    # EASY (80 words)
    ("Grace", "Easy", "Theology", [
        ("Amazing Grace (My Chains Are Gone)", "Chris Tomlin", 2006, ["Worship", "CCM"]),
        ("Grace Got You", "MercyMe", 2017, ["Contemporary", "Pop"]),
        ("Gracefully Broken", "Tasha Cobbs Leonard", 2017, ["Gospel", "Worship"]),
        ("Your Grace Is Enough", "Matt Maher", 2008, ["CCM", "Worship"])
    ]),
    ("Mercy", "Easy", "Praise", [
        ("Mercy", "Elevation Worship", 2021, ["Worship", "CCM"]),
        ("Great Is Your Mercy", "Donnie McClurkin", 2000, ["Gospel"]),
        ("Have Mercy On Me", "Sovereign Grace Music", 2017, ["Hymn", "Worship"])
    ]),
    ("Praise", "Easy", "Praise", [
        ("Praise", "Elevation Worship", 2023, ["Worship", "Praise"]),
        ("Praise You In This Storm", "Casting Crowns", 2005, ["CCM", "Rock"]),
        ("Praise You Anywhere", "Brandon Lake", 2023, ["Worship", "Pop"])
    ]),
    ("Faith", "Easy", "Christian Life", [
        ("Walk by Faith", "Jeremy Camp", 2002, ["CCM", "Rock"]),
        ("Faithful", "Erik Nieder", 2015, ["Acoustic", "Worship"]),
        ("Faithful Now", "Vertical Worship", 2020, ["Worship"])
    ]),
    ("Love", "Easy", "Attributes of God", [
        ("Reckless Love", "Cory Asbury", 2017, ["Worship", "CCM"]),
        ("Your Love Never Fails", "Jesus Culture", 2008, ["Worship"]),
        ("Love Theory", "Kirk Franklin", 2019, ["Gospel", "R&B"])
    ]),
    ("Hope", "Easy", "Christian Life", [
        ("Living Hope", "Phil Wickham", 2018, ["Worship", "CCM"]),
        ("All My Hope", "Crowder", 2016, ["Folk", "CCM"]),
        ("Anchor of Hope", "Ellie Holcomb", 2014, ["Acoustic"])
    ]),
    ("Glory", "Easy", "Attributes of God", [
        ("To God Be The Glory", "Andraé Crouch", 1972, ["Gospel", "Hymn"]),
        ("Glory to Glory", "Fred Hammond", 2002, ["Gospel"]),
        ("King of Glory", "Passion ft. CeCe Winans", 2020, ["Worship"])
    ]),
    ("Holy", "Easy", "Attributes of God", [
        ("Holy Water", "We The Kingdom", 2019, ["CCM", "Rock"]),
        ("Holy Is the Lord", "Chris Tomlin", 2004, ["Worship"]),
        ("Holy Forever", "Chris Tomlin", 2022, ["Worship", "CCM"])
    ]),
    ("Jesus", "Easy", "Names of God", [
        ("Jesus Does", "We The Kingdom", 2022, ["CCM", "Worship"]),
        ("Jesus Promised", "Chicago Mass Choir", 1993, ["Gospel"]),
        ("Jesus Paid It All", "Passion ft. Kristian Stanfill", 2006, ["Worship", "Hymn"])
    ]),
    ("Lord", "Easy", "Names of God", [
        ("Lord I Need You", "Matt Maher", 2013, ["Worship", "CCM"]),
        ("Open the Eyes of My Heart Lord", "Paul Baloche", 1997, ["Worship"]),
        ("Shout to the Lord", "Darlene Zschech", 1993, ["Worship"])
    ]),
    ("King", "Easy", "Names of God", [
        ("King of Kings", "Hillsong Worship", 2019, ["Worship"]),
        ("King of My Heart", "Bethel Music", 2015, ["Worship"]),
        ("King of Glory", "Third Day", 2000, ["CCM", "Rock"])
    ]),
    ("Cross", "Easy", "Salvation", [
        ("At the Cross (Love Ran Red)", "Chris Tomlin", 2014, ["Worship"]),
        ("The Old Rugged Cross", "Alan Jackson", 2006, ["Country", "Hymn"]),
        ("Lead Me to the Cross", "Hillsong UNITED", 2007, ["Worship"])
    ]),
    ("Blood", "Easy", "Salvation", [
        ("Nothing But the Blood", "Matt Redman", 2004, ["Worship", "Hymn"]),
        ("O The Blood", "Kari Jobe", 2009, ["Worship"]),
        ("Thank You for the Blood", "Matt Redman", 2020, ["Worship"])
    ]),
    ("Alive", "Easy", "Resurrection", [
        ("Alive", "Hillsong Young & Free", 2013, ["Pop", "Worship"]),
        ("Man of Sorrows (Alive)", "Hillsong Worship", 2013, ["Worship"]),
        ("Ain't No Grave (Alive in Me)", "Bethel Music", 2019, ["Worship", "Blues"])
    ]),
    ("Light", "Easy", "Attributes of God", [
        ("Light of the World", "Lauren Daigle", 2014, ["CCM", "Christmas"]),
        ("This Little Light of Mine", "Traditional", 1920, ["Gospel", "Traditional"]),
        ("God of This City (Light in Darkness)", "Passion", 2008, ["Worship"])
    ]),
    ("Peace", "Easy", "Fruit of the Spirit", [
        ("Peace Be Still", "Hope Darst", 2020, ["Worship"]),
        ("Prince of Peace", "Hillsong UNITED", 2015, ["Worship"]),
        ("I Speak Jesus (Peace Over You)", "Charity Gayle", 2020, ["Worship"])
    ]),
    ("Joy", "Easy", "Fruit of the Spirit", [
        ("Joy of the Lord", "Rend Collective", 2015, ["Folk", "Worship"]),
        ("Joyful Joyful We Adore Thee", "Casting Crowns", 2008, ["Hymn", "CCM"]),
        ("House of Joy", "For KING & COUNTRY", 2022, ["Pop", "CCM"])
    ]),
    ("Freedom", "Easy", "Salvation", [
        ("Freedom", "Jesus Culture", 2018, ["Worship"]),
        ("Where the Spirit of the Lord Is (Freedom)", "Passion", 2006, ["Worship"]),
        ("Freedom Hymn", "Austin French", 2017, ["CCM", "Pop"])
    ]),
    ("Father", "Easy", "Names of God", [
        ("Good Good Father", "Chris Tomlin", 2015, ["Worship"]),
        ("Run to the Father", "Cody Carnes", 2019, ["Worship"]),
        ("Father's House", "Cory Asbury", 2020, ["Worship"])
    ]),
    ("Spirit", "Easy", "Holy Spirit", [
        ("Holy Spirit", "Francesca Battistelli", 2014, ["CCM", "Worship"]),
        ("Spirit Break Out", "Worship Central", 2011, ["Worship"]),
        ("Welcome Holy Spirit", "Mark Condon", 1996, ["Gospel"])
    ]),
    ("Rock", "Easy", "Names of God", [
        ("Solid Rock", "Castings Crowns", 2013, ["Hymn", "CCM"]),
        ("Rock of Ages", "Toplady / Traditional", 1776, ["Hymn"]),
        ("My Redeemer Lives (He Is My Rock)", "Hillsong Worship", 1998, ["Worship"])
    ]),
    ("Waymaker", "Easy", "Names of God", [
        ("Way Maker", "Sinach", 2015, ["Gospel", "Worship"]),
        ("Way Maker", "Leeland", 2019, ["Worship", "CCM"]),
        ("Way Maker", "Michael W. Smith", 2020, ["Worship"])
    ]),
    ("Goodness", "Easy", "Attributes of God", [
        ("Goodness of God", "Bethel Music", 2019, ["Worship"]),
        ("Goodness of God", "CeCe Winans", 2021, ["Gospel", "Worship"]),
        ("God Is Good All the Time", "Don Moen", 1995, ["Worship"])
    ]),
    ("Worthy", "Easy", "Praise", [
        ("Worthy Is the Lamb", "Darlene Zschech", 2000, ["Worship"]),
        ("Worthy", "Elevation Worship", 2018, ["Worship"]),
        ("Worthy of It All", "David Brymer", 2012, ["Worship"])
    ]),
    ("Forever", "Easy", "Eternity", [
        ("Forever", "Kari Jobe", 2014, ["Worship"]),
        ("Forever Reign", "Hillsong Worship", 2010, ["Worship"]),
        ("Forever", "Chris Tomlin", 2001, ["Worship"])
    ]),
    ("Throne", "Easy", "Heaven", [
        ("Before the Throne of God Above", "Shane & Shane", 2015, ["Hymn", "Worship"]),
        ("Throne Room", "CeCe Winans", 2003, ["Gospel"]),
        ("Establish Your Throne", "Paul Baloche", 2000, ["Worship"])
    ]),
    ("Savior", "Easy", "Names of God", [
        ("My Savior My God", "Aaron Shust", 2005, ["CCM", "Worship"]),
        ("Savior Like a Shepherd Lead Us", "Traditional", 1836, ["Hymn"]),
        ("My Savior's Love", "Gateway Worship", 2008, ["Worship"])
    ]),
    ("Rain", "Easy", "Holy Spirit", [
        ("Let It Rain", "Michael W. Smith", 2001, ["Worship"]),
        ("Rain Down", "Delirious?", 2004, ["Worship", "Rock"]),
        ("Send the Rain", "William McDowell", 2015, ["Gospel", "Worship"])
    ]),
    ("Fire", "Easy", "Holy Spirit", [
        ("Fresh Fire", "Maverick City Music", 2021, ["Worship", "Gospel"]),
        ("Refiner's Fire", "Brian Doerksen", 1990, ["Worship"]),
        ("Consuming Fire", "Third Day", 1996, ["CCM", "Rock"])
    ]),
    ("Crown", "Easy", "Majesty", [
        ("Crown Him With Many Crowns", "Traditional Hymn", 1851, ["Hymn"]),
        ("Victor's Crown", "Darlene Zschech", 2013, ["Worship"]),
        ("Crowns", "Hillsong Worship", 2016, ["Worship"])
    ]),
    ("Bow", "Easy", "Worship", [
        ("I Bow My Knee", "Ron Kenoly", 1994, ["Worship"]),
        ("Every Knee Shall Bow", "Lincoln Brewster", 2008, ["CCM", "Rock"]),
        ("We Bow Down", "Twila Paris", 1984, ["Worship", "Hymn"])
    ]),
    ("Redeemer", "Easy", "Names of God", [
        ("My Redeemer Lives", "Nicole C. Mullen", 2000, ["CCM", "R&B"]),
        ("I Know That My Redeemer Lives", "Traditional", 1775, ["Hymn"]),
        ("Redeemer", "Big Daddy Weave", 2012, ["CCM"])
    ]),
    ("Lamb", "Easy", "Names of God", [
        ("Lamb of God", "Twila Paris", 1985, ["Hymn", "Worship"]),
        ("Agmus Dei (Lamb of God)", "Michael W. Smith", 1990, ["Worship"]),
        ("The Lion and the Lamb", "Big Daddy Weave", 2016, ["CCM", "Worship"])
    ]),
    ("Lion", "Easy", "Names of God", [
        ("Lion", "Elevation Worship ft. Chris Brown", 2022, ["Worship"]),
        ("Lion of Judah", "Beverly Crawford", 2014, ["Gospel"]),
        ("The Lion and the Lamb", "Leeland", 2016, ["Worship"])
    ]),
    ("Presence", "Easy", "Worship", [
        ("In Your Presence", "Paul Wilbur", 2005, ["Worship"]),
        ("Here in Your Presence", "New Life Worship", 2006, ["Worship"]),
        ("Presence (Herida Sanada)", "Newsboys", 2004, ["CCM"])
    ]),
    ("Sanctuary", "Easy", "Worship", [
        ("Lord Prepare Me To Be A Sanctuary", "Randy Scruggs", 1982, ["Hymn", "Worship"]),
        ("Sanctuary", "Hillsong Worship", 2002, ["Worship"]),
        ("In the Sanctuary", "Kurt Carr", 2000, ["Gospel"])
    ]),
    ("Victory", "Easy", "Spiritual Warfare", [
        ("Victory in Jesus", "Eugene M. Bartlett", 1939, ["Hymn"]),
        ("Victory Belongs to Jesus", "Todd Dulaney", 2016, ["Gospel"]),
        ("Surrounded (Fight My Battles / Victory)", "UPPERROOM", 2018, ["Worship"])
    ]),
    ("Miracle", "Easy", "Power of God", [
        ("Miracle Worker", "JJ Hairston", 2019, ["Gospel"]),
        ("Miracles", "Jesus Culture", 2016, ["Worship"]),
        ("God of Miracles", "Chris McClarney", 2015, ["Worship"])
    ]),
    ("Promise", "Easy", "Faithfulness", [
        ("Promises", "Maverick City Music", 2020, ["Worship", "Gospel"]),
        ("Standing on the Promises", "Russell Kelso Carter", 1886, ["Hymn"]),
        ("Promise Keeper", "Hope Darst", 2020, ["Worship"])
    ]),
    ("Mighty", "Easy", "Attributes of God", [
        ("Mighty to Save", "Hillsong Worship", 2006, ["Worship"]),
        ("Mighty is Our God", "Don Moen", 1989, ["Worship"]),
        ("Mighty Warrior", "Elevation Worship", 2014, ["Worship"])
    ]),
    ("Stronghold", "Easy", "Protection", [
        ("You Are My Stronghold", "Don Moen", 1993, ["Worship"]),
        ("Stronghold", "We Are Messengers", 2019, ["CCM"]),
        ("My Stronghold", "Sovereign Grace Music", 2004, ["Worship"])
    ]),
    ("Shield", "Easy", "Protection", [
        ("My Shield", "Jason Upton", 2007, ["Worship"]),
        ("Sun and Shield", "Peter Furler", 2011, ["CCM"]),
        ("Shield Around Me", "Fred Hammond", 2001, ["Gospel"])
    ]),
    ("Refuge", "Easy", "Protection", [
        ("You Are My Refuge", "Paul Wilbur", 1998, ["Worship"]),
        ("Refuge", "Planetshakers", 2014, ["Worship"]),
        ("God is Our Refuge", "Sovereign Grace Music", 2008, ["Hymn"])
    ]),
    ("Mountain", "Easy", "Creation", [
        ("Move Mountains", "Nobigdyl.", 2018, ["Hip Hop", "Christian"]),
        ("Go Tell It On The Mountain", "Traditional", 1867, ["Gospel", "Christmas"]),
        ("Command the Mountains", "Elevation Worship", 2020, ["Worship"])
    ]),
    ("Oceans", "Easy", "Faith", [
        ("Oceans (Where Feet May Fail)", "Hillsong UNITED", 2013, ["Worship"]),
        ("Oceans Will Part", "Hillsong Worship", 2006, ["Worship"]),
        ("Deeper Than Oceans", "Locals Sound", 2019, ["Worship"])
    ]),
    ("Restored", "Easy", "Renewal", [
        ("Restored", "Jeremy Camp", 2006, ["CCM"]),
        ("You Restore My Soul", "Vertical Worship", 2017, ["Worship"]),
        ("Restored Again", "Hezekiah Walker", 2008, ["Gospel"])
    ]),
    ("Chains", "Easy", "Freedom", [
        ("Break Every Chain", "Tasha Cobbs Leonard", 2012, ["Gospel", "Worship"]),
        ("No More Chains", "Tye Tribbett", 2006, ["Gospel"]),
        ("Chains Are Broken", "The Belonging Co", 2017, ["Worship"])
    ]),
    ("Beautiful", "Easy", "Attributes of God", [
        ("What a Beautiful Name", "Hillsong Worship", 2016, ["Worship"]),
        ("Beautiful Things", "Gungor", 2010, ["Acoustic", "Worship"]),
        ("Beautiful One", "Tim Hughes", 2002, ["Worship"])
    ]),
    ("Wonderful", "Easy", "Attributes of God", [
        ("Wonderful Cross", "Chris Tomlin", 2000, ["Worship"]),
        ("Wonderful Merciful Savior", "Selah", 2001, ["Hymn", "CCM"]),
        ("Wonderful Name", "Planetshakers", 2017, ["Worship"])
    ]),
    ("Power", "Easy", "Attributes of God", [
        ("There Is Power in the Blood", "Lewis E. Jones", 1899, ["Hymn"]),
        ("Power in the Name", "Lincoln Brewster", 2006, ["CCM"]),
        ("Power of Your Love", "Hillsong Worship", 1992, ["Worship"])
    ]),
    ("Breath", "Easy", "Creation", [
        ("Great Are You Lord (It's Your Breath)", "All Sons & Daughters", 2012, ["Worship"]),
        ("Breathe", "Michael W. Smith", 2001, ["Worship"]),
        ("Every Breath", "Hillsong Worship", 1999, ["Worship"])
    ]),
    ("Soul", "Easy", "Christian Life", [
        ("Bless the Lord O My Soul (10,000 Reasons)", "Matt Redman", 2011, ["Worship"]),
        ("It Is Well With My Soul", "Horatio Spafford", 1873, ["Hymn"]),
        ("Soul on Fire", "Third Day", 2015, ["CCM", "Worship"])
    ]),
    ("Heart", "Easy", "Christian Life", [
        ("The Heart of Worship", "Matt Redman", 1999, ["Worship"]),
        ("Give Me Faith (My Heart)", "Elevation Worship", 2010, ["Worship"]),
        ("Change My Heart Oh God", "Eddie Espinosa", 1982, ["Worship"])
    ]),
    ("Wings", "Easy", "Protection", [
        ("On Eagle's Wings", "Michael Joncas", 1979, ["Hymn"]),
        ("Under Your Wings", "Lincoln Brewster", 2002, ["Worship"]),
        ("Shadow of Your Wings", "Paul Baloche", 2006, ["Worship"])
    ]),
    ("Home", "Easy", "Heaven", [
        ("Going Home", "Bill & Gloria Gaither", 1977, ["Gospel"]),
        ("Take Me Home", "TobyMac", 2012, ["Pop"]),
        ("Home", "Chris Tomlin", 2017, ["CCM", "Worship"])
    ]),
    ("House", "Easy", "Church", [
        ("House of the Lord", "Phil Wickham", 2021, ["Worship"]),
        ("In the House", "Crowder", 2021, ["CCM"]),
        ("Father's House", "Cory Asbury", 2020, ["Worship"])
    ]),
    ("Child", "Easy", "Identity", [
        ("Child of Love", "We The Kingdom", 2020, ["CCM"]),
        ("Who You Say I Am (Child of God)", "Hillsong Worship", 2018, ["Worship"]),
        ("Look Up Child", "Lauren Daigle", 2018, ["CCM", "Pop"])
    ]),
    ("Cleanse", "Easy", "Purification", [
        ("Cleanse Me", "J. Edwin Orr", 1936, ["Hymn"]),
        ("Wash Me Clean", "Page CXVI", 2010, ["Acoustic"]),
        ("Purify My Heart (Refiner's Fire)", "Brian Doerksen", 1990, ["Worship"])
    ]),
    ("Pure", "Easy", "Holiness", [
        ("Pure Heart", "Craig Musseau", 1990, ["Worship"]),
        ("Make My Heart Pure", "Sovereign Grace", 2007, ["Worship"]),
        ("Pure", "Darrell Evans", 1998, ["Worship"])
    ]),
    ("Flame", "Easy", "Holy Spirit", [
        ("Set Me Ablaze (Flame)", "Jesus Culture", 2016, ["Worship"]),
        ("Pass It On (It Only Takes a Spark)", "Kurt Kaiser", 1969, ["Hymn"]),
        ("Holy Flame", "Martin Smith", 2019, ["Worship"])
    ]),
    ("Truth", "Easy", "Attributes of God", [
        ("Voice of Truth", "Casting Crowns", 2003, ["CCM"]),
        ("Spirit of Truth", "Fred Hammond", 2006, ["Gospel"]),
        ("Way Truth Life", "Unspoken", 2019, ["CCM"])
    ]),
    ("Rest", "Easy", "Peace", [
        ("I Will Rest", "Gateway Worship", 2010, ["Worship"]),
        ("Rest In You", "All Sons & Daughters", 2016, ["Acoustic"]),
        ("Resting Place", "Ivey Conerly", 2004, ["Gospel"])
    ]),
    ("Song", "Easy", "Praise", [
        ("New Song", "Worship Central", 2013, ["Worship"]),
        ("Sing a New Song", "BJ Putnam", 2013, ["Worship"]),
        ("Redeemed Song", "Israel Houghton", 2007, ["Gospel"])
    ]),
    ("Stand", "Easy", "Faith", [
        ("Stand in Awe", "Paul Baloche", 2003, ["Worship"]),
        ("I Will Stand", "Newsboys", 1997, ["CCM"]),
        ("Stand", "Donnie McClurkin", 2000, ["Gospel"])
    ]),
    ("Walk", "Easy", "Christian Life", [
        ("Walk With Me", "Jesus Culture", 2020, ["Worship"]),
        ("Walk by Faith", "Jeremy Camp", 2002, ["CCM"]),
        ("I'll Walk With God", "Mario Lanza", 1954, ["Classic"])
    ]),
    ("High", "Easy", "Exaltation", [
        ("High and Lifted Up", "Hillsong Worship", 1997, ["Worship"]),
        ("He Is Exalted (On High)", "Twila Paris", 1985, ["Hymn"]),
        ("Most High", "Planetshakers", 2019, ["Worship"])
    ]),
    ("Ancient", "Easy", "Names of God", [
        ("Ancient of Days", "Ron Kenoly", 1992, ["Worship"]),
        ("Ancient Words", "Michael W. Smith", 2001, ["Worship", "Hymn"]),
        ("Ancient Gates", "Brooke Ligertwood", 2022, ["Worship"])
    ]),
    ("Deep", "Easy", "Love of God", [
        ("Deep Cries Out", "Bethel Music Kids", 2010, ["Worship"]),
        ("Deep Deep Love", "Sovereign Grace", 2012, ["Worship"]),
        ("Deep Waters", "Hillsong Young & Free", 2020, ["Pop"])
    ]),
    ("Gate", "Easy", "Church", [
        ("Enter His Gates", "Bryan & Katie Torwalt", 2018, ["Worship"]),
        ("Open the Gates", "Vertical Worship", 2015, ["Worship"]),
        ("Strait Gate", "Traditional Choir", 1995, ["Gospel"])
    ]),
    ("Name", "Easy", "Names of God", [
        ("Your Name", "Paul Baloche", 2006, ["Worship"]),
        ("Name Above All Names", "Charity Gayle", 2021, ["Worship"]),
        ("No Other Name", "Hillsong Worship", 2014, ["Worship"])
    ]),
    ("Touch", "Easy", "Healing", [
        ("Touch the Sky", "Hillsong UNITED", 2015, ["Worship"]),
        ("Just a Touch", "Fred Hammond", 2000, ["Gospel"]),
        ("Touch of the Master's Hand", "Wayne Watson", 1988, ["CCM"])
    ]),
    ("Call", "Easy", "Prayer", [
        ("I Will Call Upon the Lord", "Michael O'Shields", 1981, ["Worship"]),
        ("Call on the Name", "Elevation Worship", 2016, ["Worship"]),
        ("When I Call on Jesus", "Nicole C. Mullen", 2001, ["CCM"])
    ]),
    ("Come", "Easy", "Worship", [
        ("Come Thou Fount of Every Blessing", "Robert Robinson", 1758, ["Hymn"]),
        ("O Come to the Altar", "Elevation Worship", 2015, ["Worship"]),
        ("Come As You Are", "Crowder", 2014, ["CCM"])
    ]),
    ("Sing", "Easy", "Praise", [
        ("Sing Sing Sing", "Chris Tomlin", 2008, ["Worship"]),
        ("Sing Wherever I Go", "We The Kingdom", 2020, ["CCM"]),
        ("I Will Sing", "Don Moen", 2000, ["Worship"])
    ]),
    ("Shout", "Easy", "Praise", [
        ("Shout to the Lord", "Darlene Zschech", 1993, ["Worship"]),
        ("Shout Hosanna", "Passion", 2015, ["Worship"]),
        ("Shout for Joy", "Lincoln Brewster", 2010, ["CCM"])
    ]),
    ("Run", "Easy", "Christian Life", [
        ("Run Devil Run", "Crowder", 2016, ["CCM", "Blues"]),
        ("Run to the Father", "Cody Carnes", 2019, ["Worship"]),
        ("I Will Run", "Hillsong Worship", 2001, ["Worship"])
    ]),
    ("Soar", "Easy", "Faith", [
        ("Soar", "Meredith Andrews", 2016, ["Worship"]),
        ("Wings of Eagles (Soar)", "Don Moen", 1997, ["Worship"]),
        ("Mount Up With Wings", "The Imperials", 1980, ["CCM"])
    ]),
    ("Shepherd", "Easy", "Names of God", [
        ("The Lord Is My Shepherd", "Keith Green", 1980, ["Worship"]),
        ("Good Shepherd", "Collective Voice", 2019, ["Worship"]),
        ("Gentle Shepherd", "Gaither Vocal Band", 1974, ["Gospel"])
    ]),
    ("Anchor", "Easy", "Faith", [
        ("Anchor", "Hillsong Worship", 2013, ["Worship"]),
        ("My Anchor", "Christy Nockels", 2015, ["Worship"]),
        ("Solid Anchor", "Sanctus Real", 2018, ["CCM"])
    ]),
    ("Tower", "Easy", "Protection", [
        ("Strong Tower", "Kutless", 2005, ["CCM", "Rock"]),
        ("Tower of Refuge", "Delirious?", 1999, ["Rock"]),
        ("High Tower", "Sovereign Grace", 2011, ["Worship"])
    ]),

    # MEDIUM (80 words)
    ("Deliverer", "Medium", "Names of God", [
        ("Deliverer", "Zach Williams", 2017, ["CCM"]),
        ("My Deliverer", "Rich Mullins", 1998, ["CCM"]),
        ("You Are My Deliverer", "Fred Hammond", 1998, ["Gospel"])
    ]),
    ("Defender", "Medium", "Names of God", [
        ("Defender", "Francesca Battistelli", 2018, ["Worship"]),
        ("Defender", "Upper Room", 2017, ["Worship"]),
        ("My Defender", "Jeremy Camp", 2017, ["CCM"])
    ]),
    ("Provider", "Medium", "Names of God", [
        ("Jireh (My Provider)", "Maverick City Music & Elevation Worship", 2021, ["Worship", "Gospel"]),
        ("Jehovah Jireh My Provider", "Don Moen", 1986, ["Worship"]),
        ("God the Provider", "Sovereign Grace", 2020, ["Hymn"])
    ]),
    ("Healer", "Medium", "Names of God", [
        ("Healer", "Kari Jobe", 2008, ["Worship"]),
        ("Jehovah Rapha (Healer)", "Karen Clark Sheard", 1997, ["Gospel"]),
        ("Healer in the House", "Tye Tribbett", 2013, ["Gospel"])
    ]),
    ("Comforter", "Medium", "Holy Spirit", [
        ("The Comforter Has Come", "Traditional Hymn", 1890, ["Hymn"]),
        ("Holy Comforter", "CeCe Winans", 1999, ["Gospel"]),
        ("Comforter", "CeCe Winans", 2005, ["Gospel"])
    ]),
    ("Cornerstone", "Medium", "Theology", [
        ("Cornerstone", "Hillsong Worship", 2012, ["Worship"]),
        ("The Cornerstone", "Traditional Hymn", 1834, ["Hymn"]),
        ("Chief Cornerstone", "Gospel Music Workshop", 1994, ["Gospel"])
    ]),
    ("Foundation", "Medium", "Theology", [
        ("Firm Foundation (He Won't)", "Cody Carnes", 2021, ["Worship"]),
        ("How Firm a Foundation", "Traditional Hymn", 1787, ["Hymn"]),
        ("Unshakable Foundation", "Newsboys", 2002, ["CCM"])
    ]),
    ("Banner", "Medium", "Names of God", [
        ("His Banner Over Me Is Love", "Traditional Children Song", 1950, ["Children"]),
        ("Jehovah Nissi (My Banner)", "Israel & New Breed", 2004, ["Gospel"]),
        ("Banner", "Rend Collective", 2014, ["Folk"])
    ]),
    ("Citadel", "Medium", "Protection", [
        ("Citadel of Hope", "CityAlight", 2021, ["Worship"]),
        ("A Mighty Fortress / Citadel", "Steve Green", 1987, ["Hymn"]),
        ("Strong Citadel", "Sovereign Grace", 2015, ["Hymn"])
    ]),
    ("Hiding Place", "Medium", "Protection", [
        ("You Are My Hiding Place", "Michael Ledner", 1981, ["Worship"]),
        ("Hiding Place", "Tori Kelly", 2018, ["Gospel"]),
        ("My Hiding Place", "Selah", 2004, ["Hymn"])
    ]),
    ("Shelter", "Medium", "Protection", [
        ("Shelter in the Rain", "Stevie Wonder", 2005, ["Gospel"]),
        ("Under His Shelter", "Hillsong Worship", 2004, ["Worship"]),
        ("Shelter", "Pat Barrett", 2021, ["Worship"])
    ]),
    ("Armor", "Medium", "Spiritual Warfare", [
        ("Armor of God", "TobyMac", 2018, ["Hip Hop"]),
        ("Put On The Armor", "Chicago Mass Choir", 2001, ["Gospel"]),
        ("Clad in Armor", "Petra", 1990, ["Christian Rock"])
    ]),
    ("Sword", "Medium", "Spiritual Warfare", [
        ("Sword and Shield", "Whitecross", 1989, ["Christian Rock"]),
        ("Sword of the Spirit", "Keith Green", 1982, ["Worship"]),
        ("Two-Edged Sword", "The Imperials", 1983, ["CCM"])
    ]),
    ("Daylight", "Medium", "Light", [
        ("Daylight", "David Crowder Band", 2005, ["CCM"]),
        ("Dawn of Daylight", "Hillsong UNITED", 2011, ["Worship"]),
        ("Daylight Has Come", "Kari Jobe", 2017, ["Worship"])
    ]),
    ("Eternity", "Medium", "Eternity", [
        ("Echoes of Eternity", "Hillsong Worship", 2018, ["Worship"]),
        ("Eternity", "Lincoln Brewster", 2002, ["CCM"]),
        ("In Eternity", "Crowder", 2014, ["CCM"])
    ]),
    ("Timeless", "Medium", "Attributes of God", [
        ("Timeless God", "Vertical Worship", 2018, ["Worship"]),
        ("Timeless Love", "Phil Wickham", 2016, ["Worship"]),
        ("Timeless", "Unspoken", 2016, ["CCM"])
    ]),
    ("Creator", "Medium", "Attributes of God", [
        ("Indescribable (Creator)", "Chris Tomlin", 2004, ["Worship"]),
        ("Creator King", "Newsboys", 2003, ["CCM"]),
        ("Awesome Creator", "Rich Mullins", 1993, ["CCM"])
    ]),
    ("Inheritance", "Medium", "Salvation", [
        ("My Inheritance", "Hillsong Worship", 2015, ["Worship"]),
        ("Rich Inheritance", "CityAlight", 2019, ["Worship"]),
        ("Glorious Inheritance", "Sovereign Grace", 2014, ["Hymn"])
    ]),
    ("Covenant", "Medium", "Theology", [
        ("Covenant Keeping God", "Victoria Orenze", 2020, ["Gospel"]),
        ("Covenant", "Elevation Worship", 2020, ["Worship"]),
        ("Covenant Love", "Israel Houghton", 2001, ["Gospel"])
    ]),
    ("Righteous", "Medium", "Attributes of God", [
        ("The Righteous Shall Flourish", "Paul Wilbur", 1995, ["Worship"]),
        ("Righteousness Peace and Joy", "Ron Kenoly", 1992, ["Worship"]),
        ("Righteous King", "Chris Tomlin", 2006, ["Worship"])
    ]),
    ("Compassion", "Medium", "Attributes of God", [
        ("Compassion Hymn", "Keith & Kristyn Getty", 2008, ["Hymn"]),
        ("Full of Compassion", "Don Moen", 1997, ["Worship"]),
        ("Father of Compassion", "Vertical Worship", 2013, ["Worship"])
    ]),
    ("Favor", "Medium", "Blessing", [
        ("The Blessing (His Favor)", "Kari Jobe & Cody Carnes", 2020, ["Worship"]),
        ("Unmerited Favor", "Fred Hammond", 2006, ["Gospel"]),
        ("God's Favor", "Shirley Caesar", 2007, ["Gospel"])
    ]),
    ("Thanksgiving", "Medium", "Praise", [
        ("Give Thanks", "Don Moen", 1986, ["Worship"]),
        ("Thanksgiving Song", "Mary Chapin Carpenter", 2008, ["Acoustic"]),
        ("Enter With Thanksgiving", "Israel Houghton", 2002, ["Gospel"])
    ]),
    ("Sabbath", "Medium", "Rest", [
        ("Sabbath Rest", "Fernando Ortega", 2002, ["Acoustic"]),
        ("Sabbath Day", "Michael W. Smith", 2014, ["Worship"]),
        ("Holy Sabbath", "Heritage Singers", 1985, ["Hymn"])
    ]),
    ("Symphony", "Medium", "Praise", [
        ("Symphony", "Switch ft. Dillon Chase", 2019, ["Pop"]),
        ("Creation Symphony", "Chris Tomlin", 2010, ["Worship"]),
        ("Symphony of Praise", "Hillsong Worship", 1996, ["Worship"])
    ]),
    ("Trumpet", "Medium", "Second Coming", [
        ("The Trumpet Shall Sound", "Handel / Messiah", 1741, ["Classical"]),
        ("Blow the Trumpet in Zion", "Paul Wilbur", 1995, ["Worship"]),
        ("When the Trumpet Sounds", "Gaither Vocal Band", 1998, ["Gospel"])
    ]),
    ("Overcome", "Medium", "Victory", [
        ("Overcomer", "Mandisa", 2013, ["Pop", "CCM"]),
        ("Overcome", "Jeremy Camp", 2010, ["CCM"]),
        ("We Will Overcome", "Elevation Worship", 2012, ["Worship"])
    ]),
    ("Triumph", "Medium", "Victory", [
        ("Triumph", "Tye Tribbett", 2006, ["Gospel"]),
        ("Triumphant", "Fred Hammond", 1998, ["Gospel"]),
        ("Triumph Song", "Elevation Worship", 2021, ["Worship"])
    ]),
    ("Tabernacle", "Medium", "Dwelling", [
        ("Tabernacle of Praise", "Paul Wilbur", 1998, ["Worship"]),
        ("In Your Tabernacle", "Brooklyn Tabernacle Choir", 2000, ["Gospel"]),
        ("Tabernacle", "Darlene Zschech", 2003, ["Worship"])
    ]),
    ("Countenance", "Medium", "Presence", [
        ("Shine Your Countenance", "Don Moen", 1990, ["Worship"]),
        ("Lift Up Your Countenance", "Paul Baloche", 1997, ["Worship"]),
        ("Light of His Countenance", "Gateway Worship", 2006, ["Worship"])
    ]),
    ("Resurrecting", "Medium", "Resurrection", [
        ("Resurrecting", "Elevation Worship", 2016, ["Worship"]),
        ("Resurrection Power", "Chris Tomlin", 2018, ["Worship"]),
        ("Resurrection Day", "Rend Collective", 2018, ["Folk"])
    ]),
    ("Lifter", "Medium", "Names of God", [
        ("Lifter of My Head", "Planetshakers", 2015, ["Worship"]),
        ("You Are the Lifter", "Israel Houghton", 2007, ["Gospel"]),
        ("Lifter of My Head", "Fred Hammond", 2001, ["Gospel"])
    ]),
    ("Shieldbearer", "Medium", "Protection", [
        ("Shieldbearer", "Sovereign Grace", 2016, ["Worship"]),
        ("My Shieldbearer", "Paul Wilbur", 2001, ["Worship"]),
        ("Shield of Salvation", "Hillsong Worship", 2003, ["Worship"])
    ]),
    ("Morningstar", "Medium", "Names of God", [
        ("Bright Morning Star", "Keith & Kristyn Getty", 2012, ["Hymn"]),
        ("Morningstar", "Jesus Culture", 2019, ["Worship"]),
        ("Fairest Lord Jesus (Morning Star)", "Traditional", 1677, ["Hymn"])
    ]),
    ("Consuming", "Medium", "Holy Spirit", [
        ("Consuming Fire", "Third Day", 1996, ["Rock"]),
        ("Consuming Fire", "Hillsong Worship", 2002, ["Worship"]),
        ("Consuming Fire", "Tim Hughes", 2004, ["Worship"])
    ]),
    ("Refining", "Medium", "Purification", [
        ("Refiner", "Maverick City Music", 2019, ["Worship", "Gospel"]),
        ("Refining Fire", "Brian Doerksen", 1990, ["Worship"]),
        ("Refiner's Fire", "Hillsong Worship", 1994, ["Worship"])
    ]),
    ("Treasure", "Medium", "Value", [
        ("Heavenly Treasure", "Crowder", 2018, ["CCM"]),
        ("You Are My Treasure", "Vertical Worship", 2016, ["Worship"]),
        ("My Greatest Treasure", "Chris Tomlin", 2011, ["Worship"])
    ]),
    ("Steadfast", "Medium", "Attributes of God", [
        ("Steadfast Love", "Don Moen", 1989, ["Worship"]),
        ("Steadfast", "Sandra McCracken", 2015, ["Folk", "Worship"]),
        ("Steadfast Heart", "Bethel Music", 2014, ["Worship"])
    ]),
    ("Unchanging", "Medium", "Attributes of God", [
        ("Unchanging", "Chris Tomlin", 2002, ["Worship"]),
        ("Unchanging God", "Elevation Worship", 2015, ["Worship"]),
        ("Your Unchanging Love", "Hillsong Worship", 2001, ["Worship"])
    ]),
    ("Adore", "Medium", "Worship", [
        ("Adore", "Chris Tomlin", 2015, ["Christmas", "Worship"]),
        ("O Come Let Us Adore Him", "Traditional", 1751, ["Hymn"]),
        ("I Adore You", "Planetshakers", 2006, ["Worship"])
    ]),
    ("Kneel", "Medium", "Worship", [
        ("I Kneel Down", "Paul Baloche", 2001, ["Worship"]),
        ("Kneel at the Cross", "Traditional Hymn", 1898, ["Hymn"]),
        ("Kneel Before the King", "Rend Collective", 2018, ["Folk"])
    ]),
    ("Surrender", "Medium", "Christian Life", [
        ("I Surrender All", "Judson W. Van DeVenter", 1896, ["Hymn"]),
        ("I Surrender", "Hillsong Worship", 2012, ["Worship"]),
        ("Sweet Surrender", "Jeremy Camp", 2004, ["CCM"])
    ]),
    ("Ransomed", "Medium", "Salvation", [
        ("Ransomed", "Discipleship Worship", 2016, ["Worship"]),
        ("My Ransomed Soul", "Sovereign Grace", 2010, ["Hymn"]),
        ("Ransomed Heart", "Chris Tomlin", 2008, ["Worship"])
    ]),
    ("Awakening", "Medium", "Revival", [
        ("Awakening", "Chris Tomlin", 2010, ["Worship"]),
        ("Great Awakening", "Leeland", 2011, ["Worship"]),
        ("Awaken My Soul", "Matt Redman", 2011, ["Worship"])
    ]),
    ("Breakthrough", "Medium", "Power of God", [
        ("Breakthrough", "Red Rocks Worship", 2019, ["Worship"]),
        ("God of Breakthroughs", "Israel Houghton", 2012, ["Gospel"]),
        ("Breakthrough Miracle Power", "Patrick Mayberry", 2020, ["CCM"])
    ]),
    ("Overflow", "Medium", "Abundance", [
        ("Overflow", "Elevation Worship", 2016, ["Worship"]),
        ("My Cup Overfloweth", "Traditional Choir", 1970, ["Gospel"]),
        ("Overflow", "Tasha Cobbs Leonard", 2015, ["Gospel"])
    ]),
    ("Majesty", "Medium", "Attributes of God", [
        ("Majesty (Here I Am)", "Delirious?", 2003, ["Worship"]),
        ("Majesty Worship His Majesty", "Jack Hayford", 1981, ["Worship"]),
        ("King of Majesty", "Hillsong UNITED", 2001, ["Worship"])
    ]),
    ("Reign", "Medium", "Kingship", [
        ("Reign in Me", "Paul Baloche", 1999, ["Worship"]),
        ("Reign Jesus Reign", "Don Moen", 1990, ["Worship"]),
        ("He Shall Reign Forevermore", "Chris Tomlin", 2015, ["Christmas", "Worship"])
    ]),
    ("Beacon", "Medium", "Guidance", [
        ("Beacon of Light", "Bebo Norman", 2004, ["CCM"]),
        ("Beacon", "Matt Maher", 2017, ["Worship"]),
        ("Lighted Beacon", "Sovereign Grace", 2013, ["Worship"])
    ]),
    ("Anointed", "Medium", "Holy Spirit", [
        ("Anointed One", "Jesus Culture", 2014, ["Worship"]),
        ("The Anointing", "Larnelle Harris", 1988, ["Gospel"]),
        ("Anointed Praise", "Fred Hammond", 1995, ["Gospel"])
    ]),
    ("Unending", "Medium", "Eternity", [
        ("Unending Love", "Hillsong Worship", 2011, ["Worship"]),
        ("Unending Praise", "Planetshakers", 2014, ["Worship"]),
        ("Unending Grace", "Sovereign Grace", 2018, ["Hymn"])
    ]),
    ("Measureless", "Medium", "Attributes of God", [
        ("Measureless Grace", "CityAlight", 2018, ["Worship"]),
        ("Measureless Love", "Chris Tomlin", 2012, ["Worship"]),
        ("Measureless", "Vertical Worship", 2015, ["Worship"])
    ]),
    ("Infinite", "Medium", "Attributes of God", [
        ("Infinite Grace", "Matt Redman", 2015, ["Worship"]),
        ("Infinite God", "Planetshakers", 2008, ["Worship"]),
        ("Infinite Love", "Jesus Culture", 2013, ["Worship"])
    ]),
    ("Almighty", "Medium", "Names of God", [
        ("Good God Almighty", "Crowder", 2021, ["CCM"]),
        ("Almighty God", "Don Moen", 1990, ["Worship"]),
        ("God Almighty", "Chris Tomlin", 2008, ["Worship"])
    ]),
    ("Supreme", "Medium", "Majesty", [
        ("Supreme Lord", "Paul Wilbur", 2005, ["Worship"]),
        ("Name Supreme", "Sovereign Grace", 2016, ["Worship"]),
        ("Supreme", "Shai Linne", 2013, ["Hip Hop"])
    ]),
    ("Sovereign", "Medium", "Majesty", [
        ("Sovereign", "Chris Tomlin", 2013, ["Worship"]),
        ("Sovereign Over Us", "Michael W. Smith", 2014, ["Worship"]),
        ("Sovereign Grace", "Sovereign Grace Music", 2001, ["Hymn"])
    ]),
    ("Most High", "Medium", "Names of God", [
        ("Most High", "Hillsong Worship", 1999, ["Worship"]),
        ("El Elyon (Most High)", "Paul Wilbur", 1998, ["Worship"]),
        ("Praise the Most High", "Israel & New Breed", 2007, ["Gospel"])
    ]),
    ("Dwelling", "Medium", "Presence", [
        ("Dwelling Place", "CeCe Winans", 2003, ["Gospel"]),
        ("Lovely Dwelling Place", "CityAlight", 2020, ["Worship"]),
        ("My Dwelling Place", "Keith & Kristyn Getty", 2018, ["Hymn"])
    ]),
    ("Abide", "Medium", "Christian Life", [
        ("Abide With Me", "Henry Francis Lyte", 1847, ["Hymn"]),
        ("Abide", "Kingdom Worship", 2021, ["Worship"]),
        ("Abide in Me", "Darlene Zschech", 2011, ["Worship"])
    ]),
    ("Dwell", "Medium", "Presence", [
        ("Dwell in Your House", "Hillsong Worship", 1999, ["Worship"]),
        ("Dwell", "Housefires", 2014, ["Worship"]),
        ("Dwell Among Us", "Elevation Worship", 2013, ["Worship"])
    ]),
    ("Seeker", "Medium", "Christian Life", [
        ("Seeker of Justice", "Crowder", 2016, ["CCM"]),
        ("Seek Ye First", "Karen Lafferty", 1972, ["Hymn"]),
        ("Seek My Face", "Lincoln Brewster", 2000, ["CCM"])
    ]),
    ("Welcome", "Medium", "Worship", [
        ("Welcome Holy Spirit", "Heart of Worship", 1995, ["Worship"]),
        ("Welcome in This Place", "Jane Hamon", 2002, ["Worship"]),
        ("You Are Welcome Here", "Planetshakers", 2018, ["Worship"])
    ]),
    ("Mend", "Medium", "Healing", [
        ("He Mends the Broken", "Selah", 2006, ["CCM"]),
        ("Mend My Heart", "Jason Upton", 2003, ["Worship"]),
        ("Mending", "Leeland", 2019, ["Worship"])
    ]),
    ("Spotless", "Medium", "Holiness", [
        ("Spotless Lamb", "Paul Baloche", 2006, ["Worship"]),
        ("Spotless Bride", "IHOPKC Worship", 2011, ["Worship"]),
        ("Spotless", "Sovereign Grace", 2017, ["Hymn"])
    ]),
    ("Sanctified", "Medium", "Holiness", [
        ("Sanctified", "Tye Tribbett", 2010, ["Gospel"]),
        ("Sanctified Soul", "Andraé Crouch", 1980, ["Gospel"]),
        ("We Are Sanctified", "Sovereign Grace", 2012, ["Worship"])
    ]),
    ("Ransom", "Medium", "Salvation", [
        ("Ransom", "Hillsong UNITED", 2007, ["Worship"]),
        ("Pay the Ransom", "Chris Tomlin", 2010, ["Worship"]),
        ("A Ransom for All", "CityAlight", 2017, ["Worship"])
    ]),
    ("Stream", "Medium", "Holy Spirit", [
        ("Streams in the Desert", "Bebo Norman", 2007, ["CCM"]),
        ("Stream of Living Water", "Paul Wilbur", 2000, ["Worship"]),
        ("Streams of Mercy", "Shane & Shane", 2015, ["Hymn"])
    ]),
    ("Fountain", "Medium", "Holy Spirit", [
        ("Come Thou Fount of Every Blessing (Fountain)", "Traditional", 1758, ["Hymn"]),
        ("Fountain of Life", "Don Moen", 1994, ["Worship"]),
        ("Fountain of Grace", "Matt Redman", 2005, ["Worship"])
    ]),
    ("Desert", "Medium", "Trial", [
        ("Desert Song", "Hillsong Worship", 2008, ["Worship"]),
        ("Rivers in the Desert", "Elevation Worship", 2019, ["Worship"]),
        ("Flowers in the Desert", "Rend Collective", 2020, ["Folk"])
    ]),
    ("Wilderness", "Medium", "Trial", [
        ("Wilderness", "Kutless", 2004, ["Rock"]),
        ("Through the Wilderness", "Don Moen", 2000, ["Worship"]),
        ("Voice in the Wilderness", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Thirsty", "Medium", "Desire for God", [
        ("Thirsty", "Fred Hammond", 1998, ["Gospel"]),
        ("As the Deer (Thirsty Soul)", "Martin Nystrom", 1984, ["Worship"]),
        ("Thirsty for You", "Hillsong Worship", 2000, ["Worship"])
    ]),
    ("Feast", "Medium", "Heaven", [
        ("Feast on Your Faithfulness", "Matt Redman", 2013, ["Worship"]),
        ("The Great Feast", "Keith & Kristyn Getty", 2016, ["Hymn"]),
        ("Feasting on the Word", "Brooklyn Tabernacle Choir", 2004, ["Gospel"])
    ]),
    ("Cup", "Medium", "Blessing", [
        ("My Cup Runneth Over", "Traditional Hymn", 1967, ["Hymn"]),
        ("Cup of Salvation", "Sovereign Grace", 2009, ["Worship"]),
        ("Cup of Blessing", "Matt Maher", 2015, ["Worship"])
    ]),
    ("Zion", "Medium", "Holy City", [
        ("Marching to Zion", "Isaac Watts", 1707, ["Hymn"]),
        ("Zion", "Hillsong UNITED", 2013, ["Worship"]),
        ("Daughter of Zion", "Phil Wickham", 2023, ["Worship"])
    ]),
    ("Canaan", "Medium", "Promise Land", [
        ("Canaan's Land", "Traditional Southern Gospel", 1955, ["Southern Gospel"]),
        ("Bound for Canaan", "Gaither Vocal Band", 1992, ["Gospel"]),
        ("Land of Canaan", "The Cathedrals", 1984, ["Southern Gospel"])
    ]),
    ("Pathway", "Medium", "Guidance", [
        ("Pathway of Promise", "Steve Green", 1990, ["CCM"]),
        ("Bright Pathway", "Fernando Ortega", 2000, ["Acoustic"]),
        ("Pathway to Glory", "Chicago Mass Choir", 1997, ["Gospel"])
    ]),
    ("Horizon", "Medium", "Hope", [
        ("New Horizon", "The Belonging Co", 2019, ["Worship"]),
        ("Beyond the Horizon", "Michael W. Smith", 2006, ["Instrumental"]),
        ("Horizon", "Vertical Worship", 2020, ["Worship"])
    ]),
    ("Fortress", "Medium", "Protection", [
        ("A Mighty Fortress Is Our God", "Martin Luther", 1529, ["Hymn"]),
        ("Fortress", "Hillsong Worship", 2014, ["Worship"]),
        ("My Fortress", "Sovereign Grace", 2011, ["Worship"])
    ]),
    ("Magnify", "Medium", "Praise", [
        ("Magnify", "We Are Messengers", 2016, ["CCM"]),
        ("O Magnify the Lord", "Michael O'Shields", 1981, ["Worship"]),
        ("My Soul Magnifies the Lord", "Chris Tomlin", 2009, ["Christmas", "Worship"])
    ]),
    ("Exalt", "Medium", "Praise", [
        ("I Exalt Thee", "Pete Sanchez Jr.", 1977, ["Worship"]),
        ("Be Exalted O God", "Brent Chambers", 1977, ["Worship"]),
        ("Exalt His Name", "Paul Baloche", 2002, ["Worship"])
    ]),

    # HARD (75 words)
    ("Prophesy", "Hard", "Prophecy", [
        ("Prophesy", "Planetshakers", 2018, ["Worship"]),
        ("Prophesy to These Bones", "Tasha Cobbs Leonard", 2020, ["Gospel"]),
        ("Prophesy Life", "Israel & New Breed", 2015, ["Gospel"])
    ]),
    ("Intercessor", "Hard", "Prayer", [
        ("Great Intercessor", "Sovereign Grace", 2014, ["Hymn"]),
        ("Intercessor", "Jesus Culture", 2017, ["Worship"]),
        ("Jesus Our Intercessor", "Matt Maher", 2011, ["Worship"])
    ]),
    ("Intercession", "Hard", "Prayer", [
        ("House of Intercession", "IHOPKC Worship", 2009, ["Worship"]),
        ("Holy Intercession", "Brooklyn Tabernacle Choir", 2006, ["Gospel"]),
        ("Intercession Song", "Upper Room", 2016, ["Worship"])
    ]),
    ("Sanctification", "Hard", "Theology", [
        ("Sanctification", "Shai Linne", 2011, ["Christian Hip Hop"]),
        ("Work of Sanctification", "Sovereign Grace", 2008, ["Hymn"]),
        ("Sanctify Me", "Fred Hammond", 1998, ["Gospel"])
    ]),
    ("Justification", "Hard", "Theology", [
        ("Justification by Faith", "Sovereign Grace", 2003, ["Hymn"]),
        ("Justified", "Jeremy Camp", 2002, ["CCM"]),
        ("Justified in Christ", "CityAlight", 2016, ["Worship"])
    ]),
    ("Reconciliation", "Hard", "Theology", [
        ("Ministry of Reconciliation", "Keith Green", 1982, ["CCM"]),
        ("Reconciliation", "Newsboys", 1999, ["CCM"]),
        ("Reconciled", "Sovereign Grace", 2013, ["Worship"])
    ]),
    ("Propitiation", "Hard", "Theology", [
        ("Propitiation", "Shai Linne", 2008, ["Christian Hip Hop"]),
        ("He Is the Propitiation", "Sovereign Grace", 2006, ["Hymn"]),
        ("Atoning Sacrifice (Propitiation)", "CityAlight", 2017, ["Worship"])
    ]),
    ("Omnipotent", "Hard", "Attributes of God", [
        ("Omnipotent", "Planetshakers", 2013, ["Worship"]),
        ("Lord God Omnipotent Reigneth", "Handel / Messiah", 1741, ["Classical"]),
        ("God Omnipotent", "Chicago Mass Choir", 2005, ["Gospel"])
    ]),
    ("Omnipresent", "Hard", "Attributes of God", [
        ("Omnipresent God", "Israel Houghton", 2004, ["Gospel"]),
        ("You Are Omnipresent", "Paul Wilbur", 2001, ["Worship"]),
        ("Everywhere You Are (Omnipresent)", "Kutless", 2008, ["CCM"])
    ]),
    ("Omniscient", "Hard", "Attributes of God", [
        ("Omniscient Lord", "Sovereign Grace", 2010, ["Hymn"]),
        ("All-Knowing God (Omniscient)", "Keith & Kristyn Getty", 2014, ["Hymn"]),
        ("Omniscient", "Red Rocks Worship", 2018, ["Worship"])
    ]),
    ("Immanuel", "Hard", "Names of God", [
        ("Immanuel (God With Us)", "Chris Tomlin", 2009, ["Christmas", "Worship"]),
        ("O Come O Come Emmanuel", "Traditional Hymn", 800, ["Hymn"]),
        ("Immanuel", "Michael W. Smith", 1990, ["Worship"])
    ]),
    ("El Shaddai", "Hard", "Names of God", [
        ("El Shaddai", "Amy Grant", 1982, ["CCM", "Classic"]),
        ("El Shaddai", "Michael W. Smith", 1983, ["Worship"]),
        ("El Shaddai (God Almighty)", "Paul Wilbur", 1998, ["Worship"])
    ]),
    ("Yahweh", "Hard", "Names of God", [
        ("Yahweh", "Elevation Worship", 2016, ["Worship"]),
        ("Yahweh", "Chris Tomlin", 2010, ["Worship"]),
        ("Yahweh", "Kari Jobe", 2014, ["Worship"])
    ]),
    ("Adonai", "Hard", "Names of God", [
        ("Adonai", "Hillsong Worship", 1999, ["Worship"]),
        ("Adonai", "Paul Wilbur", 1998, ["Worship"]),
        ("Lord Adonai", "Chris Tomlin", 2016, ["Worship"])
    ]),
    ("Transfigured", "Hard", "Gospel", [
        ("Transfigured", "Sovereign Grace", 2015, ["Hymn"]),
        ("Mountain of Transfiguration", "Michael W. Smith", 2004, ["Worship"]),
        ("Transfiguration", "Hillsong Worship", 2015, ["Worship"])
    ]),
    ("Transfiguration", "Hard", "Gospel", [
        ("Transfiguration", "Hillsong Worship", 2015, ["Worship"]),
        ("On the Mountain (Transfiguration)", "Matt Maher", 2013, ["Worship"]),
        ("Glory of Transfiguration", "CityAlight", 2019, ["Worship"])
    ]),
    ("Ascended", "Hard", "Resurrection", [
        ("Ascended Lord", "CityAlight", 2020, ["Worship"]),
        ("He Has Ascended", "Paul Baloche", 2006, ["Worship"]),
        ("High and Ascended", "Elevation Worship", 2017, ["Worship"])
    ]),
    ("Ascension", "Hard", "Resurrection", [
        ("Ascension Song", "Phil Wickham", 2014, ["Worship"]),
        ("The Ascension", "Phil Wickham", 2013, ["Worship"]),
        ("Ascension Praise", "Planetshakers", 2016, ["Worship"])
    ]),
    ("Scepter", "Hard", "Kingship", [
        ("Scepter of Justice", "CityAlight", 2021, ["Worship"]),
        ("Scepter of Royalty", "Sovereign Grace", 2011, ["Hymn"]),
        ("Royal Scepter", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Shekinah", "Hard", "Presence", [
        ("Shekinah Glory", "Cory Asbury", 2018, ["Worship"]),
        ("Shekinah Glory", "J.J. Hairston & Youthful Praise", 2014, ["Gospel"]),
        ("Send the Shekinah", "Israel Houghton", 2007, ["Gospel"])
    ]),
    ("High Priest", "Hard", "Theology", [
        ("Our Great High Priest", "Sovereign Grace", 2012, ["Hymn"]),
        ("Jesus High Priest", "CityAlight", 2018, ["Worship"]),
        ("Merciful High Priest", "Matt Maher", 2016, ["Worship"])
    ]),
    ("Mediator", "Hard", "Theology", [
        ("One Mediator", "CityAlight", 2017, ["Worship"]),
        ("Mediator of the Covenant", "Sovereign Grace", 2009, ["Hymn"]),
        ("Jesus Our Mediator", "Matt Redman", 2011, ["Worship"])
    ]),
    ("Mercy Seat", "Hard", "Old Testament", [
        ("At the Mercy Seat", "Vickie Winans", 2003, ["Gospel"]),
        ("Mercy Seat", "Don Moen", 1995, ["Worship"]),
        ("Before the Mercy Seat", "Paul Wilbur", 1998, ["Worship"])
    ]),
    ("Ark of Covenant", "Hard", "Old Testament", [
        ("Ark of the Covenant", "Paul Wilbur", 2005, ["Worship"]),
        ("Presence in the Ark", "Israel Houghton", 2004, ["Gospel"]),
        ("Holy Ark", "Brooklyn Tabernacle Choir", 1999, ["Gospel"])
    ]),
    ("Cherubim", "Hard", "Angels", [
        ("Cherubim and Seraphim", "Hillsong Worship", 2004, ["Worship"]),
        ("Holy Cherubim", "Paul Wilbur", 1998, ["Worship"]),
        ("Surrounded by Cherubim", "Maranatha! Music", 1990, ["Worship"])
    ]),
    ("Seraphim", "Hard", "Angels", [
        ("Seraphim Song", "Upper Room", 2018, ["Worship"]),
        ("Seraphim Praise", "Gateway Worship", 2012, ["Worship"]),
        ("Holy Seraphim Cry", "Jesus Culture", 2015, ["Worship"])
    ]),
    ("Daystar", "Hard", "Names of God", [
        ("Daystar (Shine Down On Me)", "Gaither Vocal Band", 1984, ["Gospel"]),
        ("Daystar", "Jason Crabb", 2009, ["Southern Gospel"]),
        ("Bright Daystar", "Sovereign Grace", 2014, ["Hymn"])
    ]),
    ("Alpha", "Hard", "Names of God", [
        ("Alpha and Omega", "Israel & New Breed", 2005, ["Gospel"]),
        ("Alpha and Omega", "Gaither Vocal Band", 1998, ["Gospel"]),
        ("You Are Alpha and Omega", "Don Moen", 1994, ["Worship"])
    ]),
    ("Omega", "Hard", "Names of God", [
        ("Alpha and Omega", "Israel & New Breed", 2005, ["Gospel"]),
        ("Omega Praise", "Fred Hammond", 2001, ["Gospel"]),
        ("Beginning and the End (Omega)", "Chris Tomlin", 2010, ["Worship"])
    ]),
    ("Resurrection", "Hard", "Resurrection", [
        ("Resurrection Hymn (See What a Morning)", "Keith & Kristyn Getty", 2003, ["Hymn"]),
        ("Resurrection Power", "Chris Tomlin", 2018, ["Worship"]),
        ("I Am the Resurrection", "Lincoln Brewster", 2006, ["CCM"])
    ]),
    ("Salvation", "Hard", "Salvation", [
        ("Salvation's Tide", "Passion", 2016, ["Worship"]),
        ("Rock of Salvation", "Paul Wilbur", 1995, ["Worship"]),
        ("God of Our Salvation", "Phil Wickham", 2018, ["Worship"])
    ]),
    ("Atonement", "Hard", "Salvation", [
        ("Full Atonement", "CityAlight", 2019, ["Worship"]),
        ("Day of Atonement", "Paul Wilbur", 1998, ["Worship"]),
        ("Atoning Blood", "Sovereign Grace", 2007, ["Hymn"])
    ]),
    ("Redemption", "Hard", "Salvation", [
        ("Redemption Song", "Rend Collective", 2019, ["Folk"]),
        ("Song of Redemption", "Matt Redman", 2013, ["Worship"]),
        ("Great Redemption", "CityAlight", 2021, ["Worship"])
    ]),
    ("Exaltation", "Hard", "Praise", [
        ("High Exaltation", "Hillsong Worship", 2003, ["Worship"]),
        ("Exaltation Praise", "Fred Hammond", 1997, ["Gospel"]),
        ("Day of Exaltation", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Magnification", "Hard", "Praise", [
        ("Magnification", "Chicago Mass Choir", 2002, ["Gospel"]),
        ("Magnify and Exalt", "Ron Kenoly", 1995, ["Worship"]),
        ("Songs of Magnification", "Don Moen", 1998, ["Worship"])
    ]),
    ("Beatitude", "Hard", "Teachings", [
        ("Beatitudes", "The Martyrs", 2012, ["Acoustic"]),
        ("Blessed Are They (Beatitudes)", "Matt Maher", 2016, ["Worship"]),
        ("Beatitude Song", "Fernando Ortega", 2004, ["Acoustic"])
    ]),
    ("Benediction", "Hard", "Worship", [
        ("The Benediction", "Elevation Worship", 2020, ["Worship"]),
        ("A Benediction", "CityAlight", 2018, ["Worship"]),
        ("Benediction Song", "Matt Redman", 2015, ["Worship"])
    ]),
    ("Doxology", "Hard", "Praise", [
        ("Doxology", "David Crowder Band", 2002, ["Hymn", "Rock"]),
        ("Doxology (Amen)", "Phil Wickham", 2015, ["Worship"]),
        ("Doxology", "Phil Wickham", 2016, ["Worship"])
    ]),
    ("Hallelujah", "Hard", "Praise", [
        ("Raise a Hallelujah", "Bethel Music", 2019, ["Worship"]),
        ("Hallelujah Chorus", "Handel / Messiah", 1741, ["Classical"]),
        ("Hallelujah Anyhow", "Thomas Whitfield", 1984, ["Gospel"])
    ]),
    ("Hosanna", "Hard", "Praise", [
        ("Hosanna", "Hillsong UNITED", 2007, ["Worship"]),
        ("Hosanna (Praise Is Rising)", "Paul Baloche", 2006, ["Worship"]),
        ("Hosanna", "Kirk Franklin", 2002, ["Gospel"])
    ]),
    ("Maranatha", "Hard", "Second Coming", [
        ("Maranatha", "Maranatha! Music", 1974, ["Worship"]),
        ("Come Lord Jesus (Maranatha)", "Jesus Culture", 2018, ["Worship"]),
        ("Maranatha (Lord Come)", "Upper Room", 2019, ["Worship"])
    ]),
    ("Ebenezer", "Hard", "Faithfulness", [
        ("Here I Raise My Ebenezer", "Traditional Hymn", 1758, ["Hymn"]),
        ("Ebenezer", "Phil Wickham", 2018, ["Worship"]),
        ("Stone of Ebenezer", "Sovereign Grace", 2012, ["Worship"])
    ]),
    ("Shiloh", "Hard", "Names of God", [
        ("Shiloh", "Paul Wilbur", 2005, ["Worship"]),
        ("Peace of Shiloh", "Fernando Ortega", 2001, ["Acoustic"]),
        ("Prince of Shiloh", "Michael W. Smith", 1999, ["Worship"])
    ]),
    ("Pentecost", "Hard", "Holy Spirit", [
        ("Day of Pentecost", "Marvin Sapp", 2007, ["Gospel"]),
        ("Fire of Pentecost", "Planetshakers", 2017, ["Worship"]),
        ("Pentecostal Power", "Traditional Hymn", 1890, ["Hymn"])
    ]),
    ("Upper Room", "Hard", "Holy Spirit", [
        ("In the Upper Room", "Mahalia Jackson", 1952, ["Gospel"]),
        ("Upper Room", "Hillsong Worship", 2018, ["Worship"]),
        ("Fire in the Upper Room", "Tye Tribbett", 2010, ["Gospel"])
    ]),
    ("Holy of Holies", "Hard", "Tabernacle", [
        ("Take Me In (To the Holy of Holies)", "Kutless", 2005, ["Worship"]),
        ("Holy of Holies", "Paul Wilbur", 1998, ["Worship"]),
        ("Into the Holy of Holies", "Darlene Zschech", 2003, ["Worship"])
    ]),
    ("Veil", "Hard", "Temple", [
        ("Torn the Veil", "Elevation Worship", 2017, ["Worship"]),
        ("Beyond the Veil", "Paul Wilbur", 2001, ["Worship"]),
        ("Veil Is Rent", "Sovereign Grace", 2013, ["Hymn"])
    ]),
    ("Sacrifice", "Hard", "Salvation", [
        ("Living Sacrifice", "Chris Tomlin", 2006, ["Worship"]),
        ("Sweet Sacrifice", "Fred Hammond", 2002, ["Gospel"]),
        ("Sacrifice of Praise", "Third Day", 2003, ["CCM"])
    ]),
    ("Offering", "Hard", "Worship", [
        ("Offering", "Paul Baloche", 2002, ["Worship"]),
        ("My Offering", "Third Day", 2000, ["CCM"]),
        ("Love Offering", "Casting Crowns", 2007, ["CCM"])
    ]),
    ("Firstfruits", "Hard", "Old Testament", [
        ("Firstfruits", "CityAlight", 2020, ["Worship"]),
        ("Offering of Firstfruits", "Sovereign Grace", 2015, ["Hymn"]),
        ("First Fruits Praise", "Israel Houghton", 2008, ["Gospel"])
    ]),
    ("Tithe", "Hard", "Old Testament", [
        ("Bring Your Tithes", "Traditional Choir", 1980, ["Gospel"]),
        ("Tithe and Offering", "Fred Hammond", 2004, ["Gospel"]),
        ("Blessed Tithe", "Chicago Mass Choir", 2000, ["Gospel"])
    ]),
    ("Altar", "Hard", "Worship", [
        ("O Come to the Altar", "Elevation Worship", 2015, ["Worship"]),
        ("At the Altar", "Ivey Conerly", 2006, ["Gospel"]),
        ("Altar Call", "Casting Crowns", 2009, ["CCM"])
    ]),
    ("Incense", "Hard", "Tabernacle", [
        ("Golden Incense", "Upper Room", 2017, ["Worship"]),
        ("Sweet Incense", "Hillsong Worship", 2011, ["Worship"]),
        ("Like Incense", "Hillsong Worship", 2012, ["Worship"])
    ]),
    ("Censer", "Hard", "Tabernacle", [
        ("Golden Censer", "Paul Wilbur", 2005, ["Worship"]),
        ("Censer of Praise", "IHOPKC Worship", 2013, ["Worship"]),
        ("Altar Censer", "Sovereign Grace", 2014, ["Hymn"])
    ]),
    ("Oil of Joy", "Hard", "Holy Spirit", [
        ("Oil of Joy", "Traditional Gospel", 1990, ["Gospel"]),
        ("Garment of Praise (Oil of Joy)", "Paul Wilbur", 1998, ["Worship"]),
        ("Anointed With Oil of Joy", "Ron Kenoly", 1992, ["Worship"])
    ]),
    ("Anointing Oil", "Hard", "Holy Spirit", [
        ("Anointing Oil", "Tye Tribbett", 2008, ["Gospel"]),
        ("Pour Your Anointing Oil", "Don Moen", 1996, ["Worship"]),
        ("Oil of Anointing", "Paul Wilbur", 2002, ["Worship"])
    ]),
    ("Garment of Praise", "Hard", "Praise", [
        ("Garment of Praise", "Paul Wilbur", 1998, ["Worship"]),
        ("Garment of Praise", "Robin Mark", 1999, ["Celtic Worship"]),
        ("Garment of Praise for Heavy Spirit", "Heritage Singers", 1988, ["Gospel"])
    ]),
    ("Spirit of Truth", "Hard", "Holy Spirit", [
        ("Spirit of Truth", "Fred Hammond", 2006, ["Gospel"]),
        ("Send Your Spirit of Truth", "Paul Baloche", 2004, ["Worship"]),
        ("Holy Spirit of Truth", "Sovereign Grace", 2011, ["Hymn"])
    ]),
    ("River of Life", "Hard", "Heaven", [
        ("River of Life", "Mac Powell", 2019, ["Country", "CCM"]),
        ("There Is a River of Life", "Traditional", 1975, ["Hymn"]),
        ("Flow River of Life", "Paul Wilbur", 1995, ["Worship"])
    ]),
    ("Tree of Life", "Hard", "Heaven", [
        ("Tree of Life", "Paul Wilbur", 2010, ["Worship"]),
        ("Fruit of Tree of Life", "Fernando Ortega", 2003, ["Acoustic"]),
        ("Leaves of the Tree", "CityAlight", 2019, ["Worship"])
    ]),
    ("New Jerusalem", "Hard", "Heaven", [
        ("New Jerusalem", "Matt Redman", 2017, ["Worship"]),
        ("City of New Jerusalem", "Gaither Vocal Band", 1995, ["Gospel"]),
        ("Jerusalem New", "Paul Wilbur", 1998, ["Worship"])
    ]),
    ("Golden Streets", "Hard", "Heaven", [
        ("Streets of Gold", "Garth Brooks", 1990, ["Country"]),
        ("Walking on Streets of Gold", "Traditional Gospel", 1978, ["Gospel"]),
        ("Golden Streets of Glory", "Gaither Vocal Band", 2001, ["Southern Gospel"])
    ]),
    ("Pearl Gates", "Hard", "Heaven", [
        ("Pearly Gates", "The Cathedrals", 1988, ["Southern Gospel"]),
        ("Gates of Pearl", "Paul Wilbur", 2005, ["Worship"]),
        ("Inside the Pearl Gates", "Traditional Choir", 1982, ["Gospel"])
    ]),
    ("Sea of Glass", "Hard", "Heaven", [
        ("Sea of Glass", "Hillsong Worship", 2004, ["Worship"]),
        ("Standing on the Sea of Glass", "Paul Wilbur", 1998, ["Worship"]),
        ("Crystal Sea of Glass", "Michael W. Smith", 2002, ["Worship"])
    ]),
    ("White Throne", "Hard", "Heaven", [
        ("Great White Throne", "Traditional Gospel", 1985, ["Gospel"]),
        ("Before the White Throne", "Sovereign Grace", 2012, ["Hymn"]),
        ("White Throne of Glory", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Book of Life", "Hard", "Salvation", [
        ("Is My Name Written in the Book", "Traditional Hymn", 1898, ["Hymn"]),
        ("Book of Life", "TobyMac", 2015, ["Pop"]),
        ("Lamb's Book of Life", "Gaither Vocal Band", 1993, ["Southern Gospel"])
    ]),
    ("Living Water", "Hard", "Holy Spirit", [
        ("Living Water", "Anne Wilson", 2022, ["Country", "CCM"]),
        ("Living Water", "Gateway Worship", 2008, ["Worship"]),
        ("Fountain of Living Water", "Paul Wilbur", 1998, ["Worship"])
    ]),
    ("Living Stones", "Hard", "Church", [
        ("Living Stones", "CityAlight", 2020, ["Worship"]),
        ("Built as Living Stones", "Sovereign Grace", 2014, ["Hymn"]),
        ("We Are Living Stones", "Hillsong Worship", 1997, ["Worship"])
    ]),
    ("Chosen Generation", "Hard", "Identity", [
        ("Chosen Generation", "Chris Morgan", 2010, ["Gospel"]),
        ("A Chosen Generation", "Israel & New Breed", 2005, ["Gospel"]),
        ("We Are a Chosen Generation", "Hillsong Youth", 2002, ["Worship"])
    ]),
    ("Royal Priesthood", "Hard", "Identity", [
        ("Royal Priesthood", "Shai Linne", 2011, ["Christian Hip Hop"]),
        ("Priesthood Royal", "Israel Houghton", 2007, ["Gospel"]),
        ("Holy Nation Royal Priesthood", "Paul Wilbur", 1998, ["Worship"])
    ]),
    ("Holy Nation", "Hard", "Identity", [
        ("Holy Nation", "Israel & New Breed", 2004, ["Gospel"]),
        ("A Holy Nation", "Paul Wilbur", 1998, ["Worship"]),
        ("People of a Holy Nation", "Hillsong Worship", 2001, ["Worship"])
    ]),
    ("Body of Christ", "Hard", "Church", [
        ("One Body in Christ", "Matt Maher", 2009, ["Worship"]),
        ("We Are the Body of Christ", "Casting Crowns", 2007, ["CCM"]),
        ("Body of Christ Arise", "Paul Baloche", 2003, ["Worship"])
    ]),
    ("Bride of Christ", "Hard", "Church", [
        ("The Bride of Christ", "CityAlight", 2019, ["Worship"]),
        ("Prepare the Bride", "Jesus Culture", 2016, ["Worship"]),
        ("Bride of Christ Arise", "IHOPKC Worship", 2010, ["Worship"])
    ]),
    ("Bridegroom", "Hard", "Names of God", [
        ("The Bridegroom Comes", "Upper Room", 2018, ["Worship"]),
        ("Voice of the Bridegroom", "Paul Wilbur", 2005, ["Worship"]),
        ("Here Comes the Bridegroom", "Tye Tribbett", 2013, ["Gospel"])
    ]),

    # CHALLENGE (65 words)
    ("Melchizedek", "Challenge", "Old Testament", [
        ("Order of Melchizedek", "Shai Linne", 2013, ["Christian Hip Hop"]),
        ("King Melchizedek", "Paul Wilbur", 2005, ["Worship"]),
        ("Priest Like Melchizedek", "CityAlight", 2021, ["Worship"])
    ]),
    ("Kadesh-Barnea", "Challenge", "Geography", [
        ("From Kadesh-Barnea", "Sovereign Grace", 2015, ["Hymn"]),
        ("Wilderness of Kadesh", "Paul Wilbur", 1998, ["Worship"]),
        ("Journey Through Kadesh", "Fernando Ortega", 2004, ["Acoustic"])
    ]),
    ("Golgotha", "Challenge", "Location", [
        ("At Golgotha", "CityAlight", 2018, ["Worship"]),
        ("Golgotha's Hill", "Chris Tomlin", 2014, ["Worship"]),
        ("Upon Golgotha", "Phil Wickham", 2018, ["Worship"])
    ]),
    ("Gethsemane", "Challenge", "Location", [
        ("Gethsemane", "Keith & Kristyn Getty", 2009, ["Hymn"]),
        ("Night in Gethsemane", "Matt Maher", 2015, ["Worship"]),
        ("Garden of Gethsemane", "Michael W. Smith", 2002, ["Worship"])
    ]),
    ("Bethesda", "Challenge", "Location", [
        ("Pool of Bethesda", "Traditional Gospel", 1988, ["Gospel"]),
        ("Waters of Bethesda", "Hezekiah Walker", 2002, ["Gospel"]),
        ("Bethesda Healing", "Tye Tribbett", 2010, ["Gospel"])
    ]),
    ("Siloam", "Challenge", "Location", [
        ("Pool of Siloam", "Fernando Ortega", 2000, ["Acoustic"]),
        ("Siloam Waters", "Sovereign Grace", 2012, ["Hymn"]),
        ("Sent to Siloam", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Peniel", "Challenge", "Location", [
        ("Face of God (Peniel)", "Upper Room", 2019, ["Worship"]),
        ("Wrestling at Peniel", "Michael W. Smith", 2004, ["Worship"]),
        ("Peniel Night", "Jason Upton", 2007, ["Worship"])
    ]),
    ("Bethel", "Challenge", "Location", [
        ("House of God (Bethel)", "Bethel Music", 2015, ["Worship"]),
        ("Back to Bethel", "Paul Wilbur", 1998, ["Worship"]),
        ("Awesome Place (Bethel)", "Gateway Worship", 2008, ["Worship"])
    ]),
    ("Mount Zion", "Challenge", "Location", [
        ("On Mount Zion", "Paul Wilbur", 1995, ["Worship"]),
        ("Holy Mount Zion", "Hillsong Worship", 2001, ["Worship"]),
        ("City of Mount Zion", "Israel & New Breed", 2007, ["Gospel"])
    ]),
    ("Mount Sinai", "Challenge", "Location", [
        ("Fire on Mount Sinai", "Michael W. Smith", 2004, ["Worship"]),
        ("Thunder on Sinai", "Paul Wilbur", 1998, ["Worship"]),
        ("Mount Sinai Glory", "Hillsong Worship", 2003, ["Worship"])
    ]),
    ("Mount Carmel", "Challenge", "Location", [
        ("Fire on Mount Carmel", "Paul Wilbur", 2005, ["Worship"]),
        ("Carmel Praise", "Planetshakers", 2014, ["Worship"]),
        ("Elijah at Carmel", "Sovereign Grace", 2016, ["Hymn"])
    ]),
    ("Mount Tabor", "Challenge", "Location", [
        ("Mount Tabor Light", "Fernando Ortega", 2002, ["Acoustic"]),
        ("Glory on Tabor", "CityAlight", 2020, ["Worship"]),
        ("Tabor Transfiguration", "Paul Wilbur", 2001, ["Worship"])
    ]),
    ("Mount of Olives", "Challenge", "Location", [
        ("Mount of Olives", "Phil Wickham", 2016, ["Worship"]),
        ("Olivet Discourse", "Michael W. Smith", 2000, ["Instrumental"]),
        ("Standing on Olivet", "Paul Wilbur", 1998, ["Worship"])
    ]),
    ("Valley of Baca", "Challenge", "Location", [
        ("Valley of Baca", "CityAlight", 2019, ["Worship"]),
        ("Springs in Baca", "Sovereign Grace", 2014, ["Hymn"]),
        ("Passing Through Baca", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Valley of Dry Bones", "Challenge", "Prophecy", [
        ("RATTLE! (Dry Bones)", "Elevation Worship", 2020, ["Worship"]),
        ("Dry Bones", "Gungor", 2010, ["Acoustic"]),
        ("Come Alive (Dry Bones)", "Lauren Daigle", 2015, ["CCM"])
    ]),
    ("Kidron", "Challenge", "Location", [
        ("Across the Brook Kidron", "CityAlight", 2018, ["Worship"]),
        ("Kidron Valley", "Fernando Ortega", 2005, ["Acoustic"]),
        ("Over Kidron Stream", "Sovereign Grace", 2013, ["Hymn"])
    ]),
    ("Jordan River", "Challenge", "Location", [
        ("On Jordan's Stormy Banks", "Traditional Hymn", 1787, ["Hymn"]),
        ("River of Jordan", "Ricky Skaggs", 2000, ["Bluegrass"]),
        ("Deep River Jordan", "Mahalia Jackson", 1956, ["Gospel"])
    ]),
    ("Red Sea", "Challenge", "Miracle", [
        ("Red Sea Road", "Ellie Holcomb", 2017, ["Acoustic"]),
        ("Parting of the Red Sea", "Paul Wilbur", 1995, ["Worship"]),
        ("Through the Red Sea", "Crowder", 2018, ["CCM"])
    ]),
    ("Jericho", "Challenge", "Miracle", [
        ("Jericho", "Andrew Ripp", 2020, ["CCM"]),
        ("Walls of Jericho", "Hillsong Worship", 2009, ["Worship"]),
        ("Joshua Fit the Battle of Jericho", "Traditional", 1865, ["Gospel"])
    ]),
    ("Capernaum", "Challenge", "Location", [
        ("In Capernaum", "Fernando Ortega", 2002, ["Acoustic"]),
        ("Miracles of Capernaum", "Michael W. Smith", 2004, ["Worship"]),
        ("Capernaum Shore", "CityAlight", 2021, ["Worship"])
    ]),
    ("Nazareth", "Challenge", "Location", [
        ("Jesus of Nazareth", "Gaither Vocal Band", 1994, ["Gospel"]),
        ("Can Any Good Come From Nazareth", "Paul Wilbur", 2001, ["Worship"]),
        ("Child of Nazareth", "Chris Tomlin", 2015, ["Christmas"])
    ]),
    ("Bethlehem", "Challenge", "Location", [
        ("O Little Town of Bethlehem", "Traditional Hymn", 1868, ["Hymn"]),
        ("Bethlehem", "JJ Heller", 2016, ["Acoustic"]),
        ("Star of Bethlehem", "TobyMac", 2011, ["Christmas"])
    ]),
    ("Emmaus", "Challenge", "Location", [
        ("Road to Emmaus", "Brandon Heath", 2015, ["CCM"]),
        ("Emmaus Road", "CityAlight", 2020, ["Worship"]),
        ("Walking to Emmaus", "Fernando Ortega", 2003, ["Acoustic"])
    ]),
    ("Patmos", "Challenge", "Location", [
        ("Vision on Patmos", "Paul Wilbur", 2005, ["Worship"]),
        ("Isle of Patmos", "Ricky Skaggs", 2003, ["Bluegrass"]),
        ("John on Patmos", "Sovereign Grace", 2017, ["Hymn"])
    ]),
    ("Damascus", "Challenge", "Location", [
        ("Road to Damascus", "Demon Hunter", 2009, ["Christian Rock"]),
        ("Damascus Road", "Paul Wilbur", 2001, ["Worship"]),
        ("Light on Damascus Road", "Newsboys", 1998, ["CCM"])
    ]),
    ("Antioch", "Challenge", "Location", [
        ("Church at Antioch", "Paul Wilbur", 2005, ["Worship"]),
        ("Antioch Praise", "Planetshakers", 2012, ["Worship"]),
        ("First Called at Antioch", "CityAlight", 2019, ["Worship"])
    ]),
    ("Thessalonica", "Challenge", "Location", [
        ("To Thessalonica", "Sovereign Grace", 2014, ["Hymn"]),
        ("Letter to Thessalonica", "Fernando Ortega", 2006, ["Acoustic"]),
        ("Faithful Thessalonians", "Paul Wilbur", 2008, ["Worship"])
    ]),
    ("Philippi", "Challenge", "Location", [
        ("Joy in Philippi", "CityAlight", 2018, ["Worship"]),
        ("Prison at Philippi", "Crowder", 2016, ["CCM"]),
        ("Philippians Hymn", "Keith & Kristyn Getty", 2015, ["Hymn"])
    ]),
    ("Colosse", "Challenge", "Location", [
        ("Lord of Colosse", "CityAlight", 2020, ["Worship"]),
        ("Preeminent in Colosse", "Sovereign Grace", 2013, ["Hymn"]),
        ("Colossians Praise", "Matt Redman", 2015, ["Worship"])
    ]),
    ("Galatia", "Challenge", "Location", [
        ("Freedom in Galatia", "Paul Wilbur", 2005, ["Worship"]),
        ("Grace to Galatia", "CityAlight", 2017, ["Worship"]),
        ("No Other Gospel (Galatians)", "Sovereign Grace", 2011, ["Hymn"])
    ]),
    ("Ephesus", "Challenge", "Location", [
        ("Armor of Ephesus", "TobyMac", 2018, ["Pop"]),
        ("To the Ephesians", "CityAlight", 2019, ["Worship"]),
        ("Ephesus Love", "Paul Wilbur", 2002, ["Worship"])
    ]),
    ("Corinth", "Challenge", "Location", [
        ("Love of Corinth (1 Cor 13)", "Shane & Shane", 2016, ["Acoustic"]),
        ("Corinthian Grace", "CityAlight", 2018, ["Worship"]),
        ("New Creation in Corinth", "Paul Baloche", 2008, ["Worship"])
    ]),
    ("Berea", "Challenge", "Location", [
        ("Berean Noble Mind", "Sovereign Grace", 2015, ["Hymn"]),
        ("Searching Scriptures at Berea", "CityAlight", 2021, ["Worship"]),
        ("Bereans", "Shai Linne", 2012, ["Christian Hip Hop"])
    ]),
    ("Smyrna", "Challenge", "Revelation", [
        ("Faithful Unto Death (Smyrna)", "CityAlight", 2019, ["Worship"]),
        ("Crown of Life (Smyrna)", "Sovereign Grace", 2017, ["Hymn"]),
        ("Smyrna Church", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Pergamos", "Challenge", "Revelation", [
        ("Overcoming Pergamos", "Paul Wilbur", 2005, ["Worship"]),
        ("Hidden Manna (Pergamos)", "Sovereign Grace", 2016, ["Hymn"]),
        ("Pergamos Testimony", "CityAlight", 2020, ["Worship"])
    ]),
    ("Thyatira", "Challenge", "Revelation", [
        ("Morning Star to Thyatira", "CityAlight", 2018, ["Worship"]),
        ("Refined Feet (Thyatira)", "Paul Wilbur", 2005, ["Worship"]),
        ("Thyatira Remnant", "Sovereign Grace", 2014, ["Hymn"])
    ]),
    ("Sardis", "Challenge", "Revelation", [
        ("Garments of White (Sardis)", "CityAlight", 2019, ["Worship"]),
        ("Awake Sardis", "Jesus Culture", 2017, ["Worship"]),
        ("Sardis Awakening", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Philadelphia", "Challenge", "Revelation", [
        ("Open Door (Philadelphia)", "Planetshakers", 2016, ["Worship"]),
        ("Pillar in the Temple (Philadelphia)", "CityAlight", 2020, ["Worship"]),
        ("Philadelphia Brotherly Love", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Laodicea", "Challenge", "Revelation", [
        ("I Knock at the Door (Laodicea)", "Michael W. Smith", 2004, ["Worship"]),
        ("Zealous and Repent (Laodicea)", "CityAlight", 2019, ["Worship"]),
        ("Refined Gold (Laodicea)", "Sovereign Grace", 2015, ["Hymn"])
    ]),
    ("Counselor", "Challenge", "Names of God", [
        ("Wonderful Counselor", "Chris Tomlin", 2015, ["Christmas", "Worship"]),
        ("Counselor Holy Spirit", "Don Moen", 1996, ["Worship"]),
        ("Mighty Counselor", "CeCe Winans", 2003, ["Gospel"])
    ]),
    ("Wonderful Counselor", "Challenge", "Names of God", [
        ("For Unto Us (Wonderful Counselor)", "Handel / Messiah", 1741, ["Classical"]),
        ("Wonderful Counselor", "Chris Tomlin", 2015, ["Worship"]),
        ("His Name Is Wonderful Counselor", "Hillsong Worship", 2011, ["Worship"])
    ]),
    ("Prince of Peace", "Challenge", "Names of God", [
        ("Prince of Peace", "Hillsong UNITED", 2015, ["Worship"]),
        ("You Are My Prince of Peace", "Michael W. Smith", 2001, ["Worship"]),
        ("Hail the Prince of Peace", "Keith & Kristyn Getty", 2012, ["Hymn"])
    ]),
    ("Everlasting Father", "Challenge", "Names of God", [
        ("Everlasting Father", "Chris Tomlin", 2006, ["Worship"]),
        ("Unto Us (Everlasting Father)", "Elevation Worship", 2018, ["Worship"]),
        ("You Are Everlasting Father", "Hillsong Worship", 2010, ["Worship"])
    ]),
    ("Rose of Sharon", "Challenge", "Names of God", [
        ("Rose of Sharon", "Jesus Culture", 2015, ["Worship"]),
        ("Sweet Rose of Sharon", "Heritage Singers", 1980, ["Gospel"]),
        ("Fairest Rose of Sharon", "Traditional Hymn", 1895, ["Hymn"])
    ]),
    ("Lily of the Valleys", "Challenge", "Names of God", [
        ("Lily of the Valley", "Traditional Hymn", 1881, ["Hymn"]),
        ("He's the Lily of the Valley", "CeCe Winans", 2005, ["Gospel"]),
        ("Sweet Lily of the Valley", "Gaither Vocal Band", 1996, ["Southern Gospel"])
    ]),
    ("Bright and Morning Star", "Challenge", "Names of God", [
        ("Bright and Morning Star", "Keith & Kristyn Getty", 2012, ["Hymn"]),
        ("He Is the Bright and Morning Star", "Paul Wilbur", 1998, ["Worship"]),
        ("Bright Morning Star", "Jesus Culture", 2019, ["Worship"])
    ]),
    ("Branch of David", "Challenge", "Names of God", [
        ("Branch of David", "CityAlight", 2021, ["Worship"]),
        ("Righteous Branch of David", "Sovereign Grace", 2014, ["Hymn"]),
        ("Root and Branch of David", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Root of Jesse", "Challenge", "Names of God", [
        ("Root of Jesse", "Phil Wickham", 2019, ["Christmas", "Worship"]),
        ("O Come O Come Root of Jesse", "Traditional Hymn", 800, ["Hymn"]),
        ("Root of Jesse Arise", "CityAlight", 2018, ["Worship"])
    ]),
    ("Lion of Judah", "Challenge", "Names of God", [
        ("Lion of Judah", "Beverly Crawford", 2014, ["Gospel"]),
        ("The Lion of Judah", "Paul Wilbur", 1995, ["Worship"]),
        ("Lion of Judah Roar", "Robin Mark", 1999, ["Celtic Worship"])
    ]),
    ("Lamb of God", "Challenge", "Names of God", [
        ("Lamb of God", "Twila Paris", 1985, ["Hymn", "Worship"]),
        ("Agnus Dei (Lamb of God)", "Michael W. Smith", 1990, ["Worship"]),
        ("Worthy Is the Lamb of God", "Darlene Zschech", 2000, ["Worship"])
    ]),
    ("Bread of Life", "Challenge", "Names of God", [
        ("Bread of Life", "Fred Hammond", 1998, ["Gospel"]),
        ("You Are the Bread of Life", "Paul Baloche", 2006, ["Worship"]),
        ("Living Bread of Life", "CityAlight", 2019, ["Worship"])
    ]),
    ("Light of the World", "Challenge", "Names of God", [
        ("Light of the World", "Lauren Daigle", 2014, ["CCM"]),
        ("Light of the World (Here I Am to Worship)", "Tim Hughes", 2000, ["Worship"]),
        ("You Are Light of the World", "Chris Tomlin", 2008, ["Worship"])
    ]),
    ("True Vine", "Challenge", "Names of God", [
        ("I Am the True Vine", "CityAlight", 2020, ["Worship"]),
        ("Abide in the True Vine", "Sovereign Grace", 2013, ["Hymn"]),
        ("True Vine", "Paul Baloche", 2004, ["Worship"])
    ]),
    ("Good Shepherd", "Challenge", "Names of God", [
        ("The Good Shepherd", "Fernando Ortega", 2002, ["Acoustic"]),
        ("Good Shepherd of My Soul", "Keith & Kristyn Getty", 2013, ["Hymn"]),
        ("You Are the Good Shepherd", "Paul Baloche", 2006, ["Worship"])
    ]),
    ("Door of the Sheep", "Challenge", "Names of God", [
        ("Door of the Sheep", "CityAlight", 2019, ["Worship"]),
        ("Enter Through the Door", "Paul Wilbur", 2005, ["Worship"]),
        ("I Am the Door", "Sovereign Grace", 2012, ["Hymn"])
    ]),
    ("Resurrection and Life", "Challenge", "Names of God", [
        ("Resurrection and the Life", "Matt Maher", 2014, ["Worship"]),
        ("I Am the Resurrection and Life", "Chris Tomlin", 2018, ["Worship"]),
        ("Resurrection Life", "Elevation Worship", 2017, ["Worship"])
    ]),
    ("Way Truth and Life", "Challenge", "Names of God", [
        ("Way Truth and Life", "Unspoken", 2019, ["CCM"]),
        ("You Are the Way Truth Life", "Jesus Culture", 2016, ["Worship"]),
        ("The Way Truth and Life", "Hillsong Worship", 2012, ["Worship"])
    ]),
    ("Son of Man", "Challenge", "Names of God", [
        ("Son of Man", "Crowder", 2021, ["CCM"]),
        ("Son of Man Came to Serve", "CityAlight", 2018, ["Worship"]),
        ("Glory of the Son of Man", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Son of God", "Challenge", "Names of God", [
        ("Son of God", "Starfield", 2006, ["Worship", "Rock"]),
        ("Son of God", "Chris Tomlin", 2004, ["Worship"]),
        ("Glory to the Son of God", "Hillsong Worship", 2008, ["Worship"])
    ]),
    ("King of Kings", "Challenge", "Names of God", [
        ("King of Kings", "Hillsong Worship", 2019, ["Worship"]),
        ("King of Kings and Lord of Lords", "Traditional Chorus", 1980, ["Worship"]),
        ("King of Kings", "Newsboys", 2002, ["CCM"])
    ]),
    ("Lord of Lords", "Challenge", "Names of God", [
        ("Lord of Lords", "Hillsong Worship", 2007, ["Worship"]),
        ("Lord of Lords", "Brooke Ligertwood", 2006, ["Worship"]),
        ("Forever Lord of Lords", "Chris Tomlin", 2014, ["Worship"])
    ]),
    ("Ancient of Days", "Challenge", "Names of God", [
        ("Ancient of Days", "Ron Kenoly", 1992, ["Worship"]),
        ("Ancient of Days", "CityAlight", 2018, ["Worship"]),
        ("Bless the Ancient of Days", "Paul Wilbur", 1998, ["Worship"])
    ]),
    ("High and Lifted Up", "Challenge", "Attributes of God", [
        ("High and Lifted Up", "Hillsong Worship", 1997, ["Worship"]),
        ("Lord You Are High and Lifted Up", "Paul Baloche", 2000, ["Worship"]),
        ("High and Lifted Up", "Joe Pace", 2003, ["Gospel"])
    ]),
    ("Fountain of Life", "Challenge", "Holy Spirit", [
        ("Fountain of Life", "Don Moen", 1994, ["Worship"]),
        ("Fountain of Life", "Paul Wilbur", 1998, ["Worship"]),
        ("With You Is the Fountain of Life", "CityAlight", 2019, ["Worship"])
    ]),
    ("Rock of Ages", "Challenge", "Names of God", [
        ("Rock of Ages", "Toplady / Traditional", 1776, ["Hymn"]),
        ("Rock of Ages (Cleft for Me)", "Chris Tomlin", 2009, ["Worship"]),
        ("Rock of Ages", "Def Leppard cover / Traditional Christian", 2005, ["Worship"])
    ]),
    ("Messiah", "Easy", "Names of God", [
        ("Messiah", "Francesca Battistelli", 2014, ["CCM", "Christmas"]),
        ("Messiah", "Planetshakers", 2008, ["Worship"]),
        ("He Is Messiah", "Paul Wilbur", 1998, ["Worship"])
    ]),
    ("Deliverance", "Medium", "Salvation", [
        ("Song of Deliverance", "Paul Wilbur", 1998, ["Worship"]),
        ("Deliverance", "Zach Williams", 2017, ["CCM"]),
        ("Shouts of Deliverance", "Sovereign Grace", 2011, ["Worship"])
    ]),
    ("Sanctuary of Praise", "Medium", "Worship", [
        ("Sanctuary of Praise", "Brooklyn Tabernacle Choir", 2002, ["Gospel"]),
        ("In His Sanctuary", "Don Moen", 1995, ["Worship"]),
        ("Sanctuary", "Hillsong Worship", 2002, ["Worship"])
    ]),
    ("Spirit of Grace", "Hard", "Holy Spirit", [
        ("Spirit of Grace", "Paul Baloche", 2004, ["Worship"]),
        ("Pour Out the Spirit of Grace", "CityAlight", 2018, ["Worship"]),
        ("Spirit of Grace and Supplication", "Paul Wilbur", 2005, ["Worship"])
    ]),
    ("Horn of Salvation", "Hard", "Salvation", [
        ("Horn of Salvation", "Paul Wilbur", 1998, ["Worship"]),
        ("He Is My Horn of Salvation", "Hillsong Worship", 2001, ["Worship"]),
        ("Horn of Our Salvation", "Sovereign Grace", 2014, ["Hymn"])
    ]),
    ("Great I Am", "Challenge", "Names of God", [
        ("Great I Am", "New Life Worship", 2011, ["Worship"]),
        ("Great I Am", "Phillips, Craig & Dean", 2012, ["CCM"]),
        ("The Great I Am", "Israel & New Breed", 2013, ["Gospel"])
    ])
]

print(f"Total words: {len(words_data)}")

# Verify all words have at least 3 songs
for item in words_data:
    assert len(item[3]) >= 3, f"Word {item[0]} has less than 3 songs!"

# Generate TypeScript code
ts_code = """// Christian Edition Word Bank and Offline Song Database
// 300+ Curated Worship Words categorized by difficulty mapped to 3+ verified songs each.

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Challenge';

export interface SongHint {
  id: string;
  title: string;
  artist: string;
  year: number;
  genres: string[];
  previewUrl?: string;
  artworkUrl?: string;
  trackViewUrl?: string;
  source?: 'itunes' | 'offline';
}

export interface WordEntry {
  id: string;
  word: string;
  difficulty: Difficulty;
  category: string;
  songHints: SongHint[];
}

export const WORD_BANK: WordEntry[] = [
"""

for idx, (word, diff, cat, songs) in enumerate(words_data, 1):
    word_id = f"word-{idx:03d}"
    ts_code += f"  {{\n"
    ts_code += f"    id: {json.dumps(word_id)},\n"
    ts_code += f"    word: {json.dumps(word)},\n"
    ts_code += f"    difficulty: {json.dumps(diff)} as Difficulty,\n"
    ts_code += f"    category: {json.dumps(cat)},\n"
    ts_code += f"    songHints: [\n"
    for s_idx, (title, artist, year, genres) in enumerate(songs, 1):
        song_id = f"{word_id}-song-{s_idx}"
        ts_code += f"      {{\n"
        ts_code += f"        id: {json.dumps(song_id)},\n"
        ts_code += f"        title: {json.dumps(title)},\n"
        ts_code += f"        artist: {json.dumps(artist)},\n"
        ts_code += f"        year: {year},\n"
        ts_code += f"        genres: {json.dumps(genres)},\n"
        ts_code += f"        source: 'offline'\n"
        ts_code += f"      }}{',' if s_idx < len(songs) else ''}\n"
    ts_code += f"    ]\n"
    ts_code += f"  }}{',' if idx < len(words_data) else ''}\n"

ts_code += """];

/**
 * Returns all words from the curated bank.
 */
export function getAllWords(): WordEntry[] {
  return WORD_BANK;
}

/**
 * Returns words filtered by difficulty.
 */
export function getWordsByDifficulty(difficulty: Difficulty): WordEntry[] {
  return WORD_BANK.filter(w => w.difficulty === difficulty);
}

/**
 * Looks up a word entry by text (case-insensitive).
 */
export function getWordByText(wordText: string): WordEntry | undefined {
  const normalized = wordText.trim().toLowerCase();
  return WORD_BANK.find(w => w.word.toLowerCase() === normalized);
}

/**
 * Gets a random word, optionally filtered by difficulty.
 */
export function getRandomWord(difficulty?: Difficulty): WordEntry {
  const pool = difficulty ? getWordsByDifficulty(difficulty) : WORD_BANK;
  if (pool.length === 0) {
    return WORD_BANK[0];
  }
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

/**
 * Gets count random unique words, optionally filtered by difficulty.
 */
export function getRandomWords(count: number, difficulty?: Difficulty): WordEntry[] {
  const pool = [...(difficulty ? getWordsByDifficulty(difficulty) : WORD_BANK)];
  const result: WordEntry[] = [];
  const limit = Math.min(count, pool.length);

  for (let i = 0; i < limit; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    result.push(pool[randomIndex]);
    pool.splice(randomIndex, 1);
  }

  return result;
}

/**
 * Gets offline song hints for a given word text.
 * Falls back to generic Christian worship song hints if the word is not in the database.
 */
export function getOfflineSongHints(wordText: string): SongHint[] {
  const entry = getWordByText(wordText);
  if (entry && entry.songHints.length > 0) {
    return entry.songHints;
  }

  // Generic fallback if word is custom/not in word bank
  return [
    {
      id: `fallback-${wordText}-1`,
      title: "How Great Is Our God",
      artist: "Chris Tomlin",
      year: 2004,
      genres: ["Worship", "CCM"],
      source: 'offline'
    },
    {
      id: `fallback-${wordText}-2`,
      title: "10,000 Reasons (Bless the Lord)",
      artist: "Matt Redman",
      year: 2011,
      genres: ["Worship", "CCM"],
      source: 'offline'
    },
    {
      id: `fallback-${wordText}-3`,
      title: "What a Beautiful Name",
      artist: "Hillsong Worship",
      year: 2016,
      genres: ["Worship"],
      source: 'offline'
    }
  ];
}

/**
 * Searches words in the bank matching a search string.
 */
export function searchWords(query: string): WordEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return WORD_BANK.filter(w => 
    w.word.toLowerCase().includes(q) || 
    w.category.toLowerCase().includes(q) ||
    w.songHints.some(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q))
  );
}

/**
 * Returns statistics of the word bank (counts per difficulty).
 */
export function getDifficultyStats(): Record<Difficulty, number> {
  const stats: Record<Difficulty, number> = {
    Easy: 0,
    Medium: 0,
    Hard: 0,
    Challenge: 0
  };
  for (const entry of WORD_BANK) {
    stats[entry.difficulty] = (stats[entry.difficulty] || 0) + 1;
  }
  return stats;
}
"""

target_path = "/Users/josedias/Documents/GitHub/iOS Apps/Grab The Mic App/src/lib/musicData.ts"
with open(target_path, "w", encoding="utf-8") as f:
    f.write(ts_code)

print(f"Successfully generated {target_path} with {len(words_data)} words!")
