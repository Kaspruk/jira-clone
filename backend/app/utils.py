def generate_db_query(pure_query: str, data: dict) -> str:
    template = ", ".join([f"{key} = %s" for key in data.keys()])
    return pure_query.format(template=template)


