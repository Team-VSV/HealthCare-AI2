import openml
dataset = openml.datasets.get_dataset(45547)
X, y, categorical_indicator, attribute_names = dataset.get_data(
    dataset_format="dataframe", target=dataset.default_target_attribute
)
print("Shape", X.shape)
print("Features:\n", X.dtypes)
