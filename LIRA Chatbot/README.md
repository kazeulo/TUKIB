# **How to Install Rasa:**

1. Download and install [Python 3.9](https://www.python.org/downloads/release/python-390/) or any version compatible with Rasa.
2. Download and install [Anaconda](https://www.anaconda.com/download).
3. Download and install [Visual C++](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist?view=msvc-170) (required for some Rasa dependencies).
4. Open the Anaconda Command Prompt.
5. Navigate to the folder where you want to create your chatbot project.
6. Create a new conda environment with the following command:
```
conda create --name rasa_environment python=3.9
```
7. Activate the new environment:
```
conda activate rasa_environment
```
8. Install necessary packages:
```
conda install ujson
pip install tensorflow
pip install rasa
```
9. Initialize Rasa to create the default project files:
```
rasa init
```
Congratulations! You’ve set up your own Rasa chatbot.

# **Edit this Project:**
### Setting Up VS Code as the IDE:
1. Open VS Code and select the Python interpreter associated with the rasa_environment (the environment you created).
2. Open Rasa shell
```
rasa shell
```
### Integrate with React ###
1. Train Rasa to update:
```
rasa train
```
2. To webhook with React
```
rasa run --enable-api --cors "*"
```