## EZ-Projector by Tomerxp

![showcase](https://github.com/Tomerxp/FiveM-Projector/blob/main/showcase.png?raw=true)

### Synced projector to show & watch whatever is on the internet
* This will only render once a player is within the range (default 12.0)
* Projector is set to MRPD brief room but can easily get modified
* Want 2 projectors simultaneously? copy pasta the gfx file

dependencies (can easily be modified to suit your needs)
- qbcore
- qb-input https://github.com/qbcore-framework/qb-input
- qb-target

Todo
- Link validation
- Link Limitation (regex for checking trusted sites)

I wrote this script multiple times, this is the implementation of it.

Firstly in Lua but the result was pretty bad, it had blurry edges and it got rendered poorly.
reworked it in JS and looks great
