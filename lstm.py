from tensorflow.keras.models import load_model
import numpy as np
import datetime as dt
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler

prediction_days = 60
forecast = 30

# Load the model
model = load_model("0388_lstm_model.h5")

# Load test data
test_start = dt.datetime(2020, 1, 1)
test_end = dt.datetime.now()

company = "0388.HK"
test_data = yf.download(company, test_start, test_end)

# Prepare data
scalar = MinMaxScaler(feature_range=(0, 1))
scaled_data = scalar.fit_transform(test_data ['Close'].values.reshape(-1, 1))


real_data = [scaled_data[len(scaled_data)  - prediction_days:len(scaled_data) + 2, 0]]

real_data = np.array(real_data)
real_data = np.reshape(real_data, (real_data.shape[0], real_data.shape[1], 1))


# Predict next 30 days
predicted_prices = []
for _ in range(forecast):
    predicted_price = model.predict(real_data)
    predicted_prices.append(predicted_price[0, 0])

    # Update the input data for the next prediction
    real_data = np.roll(real_data, -1, axis=1)
    real_data[0, -1, 0] = predicted_price

predicted_prices = scalar.inverse_transform(np.array(predicted_prices).reshape(-1, 1))

# Print the predicted prices for the next 30 days
print(predicted_prices)