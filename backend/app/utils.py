from typing import Callable

def generate_db_query(pure_query: str, data: dict) -> str:
    template = ", ".join([f"{key} = %s" for key in data.keys()])
    return pure_query.format(template=template)

def update_order_map(oldIndex: int, newIndex: int, callback: Callable[[int], None]):
    isPositive = newIndex > oldIndex
    rangeValue = None
    
    if isPositive: rangeValue = range(oldIndex + 1, newIndex + 1)
    else: rangeValue = range(oldIndex - 1, newIndex - 1, -1)
    
    for index in rangeValue:
        if isPositive:
            callback(index, index - 1)
        else:
            callback(index, index + 1)

