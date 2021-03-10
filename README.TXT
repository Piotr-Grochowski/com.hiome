This app adds Hiome occupancy & door sensors support for Homey.

Hiome Door is a small sensor for your door, a giant leap for your home. 
It knows exactly how many people are in each room, even if you haven't moved for hours. 
Your lights stay on while you're in the room, and immediately turn off when you leave. 
No more waving your arms around in the dark.

Already working:
- discovery of occupancy & door sensors connected to Hiome Core
- occupancy sensor support (indicates that a room is occupied and the number of persons in a room)
- door sensor support (indication if a door is opened or closed)
- flow support (triggers a flow when number of people in a room changed or a room becomes (un-)occupied)
- batttery pack support (battery level reporting)
- ability to change the number of people in a room from Homey (Hiome Core error compensation)
- support for Hiome Core in a different than standard (hiome.local) location
- two Hiome Cores support (for larger installations)

To do:
- device avaibility status based on last_seen parameter
- additional sensor informations (like version number)
- update sensitivity level from device settings and flows

