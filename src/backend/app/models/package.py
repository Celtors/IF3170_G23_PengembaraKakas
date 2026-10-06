from app.models.dimensions import Dimensions

class Package:
    def __init__(
            self,
            id: str,
            dimension: Dimensions,
            value: int,
            weight: int,
            is_fragile: bool,
            eta:int
        ):
        self.id = id
        self.dimension = dimension
        self.value = value
        self.weight = weight
        self.is_fragile = is_fragile
        self.eta = eta

    def get_dimension(self):
        return self.dimension

    def get_id(self): return self.id

