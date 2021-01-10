This app adds Hiome occupancy & door sensors support for Homey.

Hiome Door is a small sensor for your door, a giant leap for your home. 
It knows exactly how many people are in each room, even if you haven't moved for hours. 
Your lights stay on while you're in the room, and immediately turn off when you leave. 
No more waving your arms around in the dark.

NOTICE: if you updated to 2.0 or above from previous versions, it's required to recreate all the devices as Hiome MQTT API changed.

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

Practical informations on error compensation:
- You can use maintenance actions to increment/decrement/reset occupancy in a room
- You can use application configuration page to increment/decrement occupancy in multiple rooms
- You can also increment/decrement/reset/set number of persons from a flow
- If you have any motion sensors in a room you can make a flow which triggers on motion, checks if in that room the number of people is >0. If not - increase (movement means that somebody is inside).

Additional informations regarding battery reporting
- If battery is connected, then battery alarm and battery level are reported
- If battery is not connected, but you use power outlet - battery level is reported as unknown and battery alarm always as OK
- Sensor meausres pattery pack voltage (3,3V - 4,2V). So Homey calculates battery level depending on the voltage value. But decrease in voltage is not linear. It will drop quickly from 4.2V to 3.6V and will stay at this level for most of battery life as this is nominal voltage of the battery pack. Then it will drop down. So most of the time battery level will be reported as around 30%. 
- Battery alarm is fired when the voltage goes below 3.5V. It gives you a few days to recharge battery pack. 

Thanks to Adrian Rockall for contributing to config page development.
