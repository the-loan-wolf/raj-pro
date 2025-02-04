import LottieView from "lottie-react-native";

const LoadingSpinner = () => {
  return (
    <LottieView
      source={require("./spinnerAnimation.json")} // Your Lottie file
      autoPlay
      loop
      style={{ width: 100, height: 100 }}
    />
  );
};

export default LoadingSpinner;
