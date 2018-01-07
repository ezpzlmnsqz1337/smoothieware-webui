M104 S0 ; hotend off
M140 S0 ; bed off
M107 ; fan off
G1 X0 F3600; move carriage out of the way
G1 Y200 F3600 ; present print for mendels
M84 ; motors off