from enum import Enum

class Orientation (Enum):
    WLH = (0, 1, 2)
    WHL = (0, 2, 1)
    LWH = (1, 0, 2)
    LHW = (1, 2, 0)
    HWL = (2, 0, 1)
    HLW = (2, 1, 0)