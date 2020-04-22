Hiome

Adds support for Hiome.com occupancy & door sensors. 
Hiome Door is a small sensor for your door, a giant leap for your home. 
It knows exactly how many people are in each room, even if you haven't moved for hours. 
Your lights stay on while you're in the room, and immediately turn off when you leave. 
No more waving your arms around in the dark.

This driver assumes that Hiome Core is available at a standard location at http://hiome.local.

Already working:
- discovery of occupancy sensors connected to Hiome Core
- occupancy sensor support (indicates that a room is occupied and the number of persons in a room)
- flow support (triggers a flow when number of people in a room changed or a room becomes (un-)occupied)

To do:
- door sensor support (indication if a door is opened or closed)
- support for Hiome Core in a different than standard location
- multiple Hiome Core support
- ability to change the number of people in a room from Homey (Hiome Core error compensation)
- batttery pack support (battery level reporting)
