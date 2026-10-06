from app.models.orientation import Orientation

class Dimensions:
    def __init__(self, w: int, h: int, l: int):
        self.w = w
        self.l = l
        self.h = h

    def get_w(self): return self.w
    def get_l(self): return self.l
    def get_h(self): return self.h
    def get_wlh(self): return (self.w, self.l, self.h)
    def get_dimension_orient(self, orient: Orientation):
        return tuple(self.get_wlh()[i] for i in orient.value)