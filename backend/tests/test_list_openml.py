from sklearn.datasets import fetch_openml
import openml
import pandas as pd

datasets = openml.datasets.list_datasets()
datasets_df = pd.DataFrame.from_dict(datasets, orient='index')
heart_datasets = datasets_df[datasets_df['name'].str.lower().str.contains('heart|cardio')]
print(heart_datasets[['name', 'NumberOfInstances', 'NumberOfFeatures']].sort_values('NumberOfInstances', ascending=False).head(10))
