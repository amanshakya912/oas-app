import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CountDown from "react-native-countdown-component";

interface CountdownTimerProps {
  countdownDate: Date | string | number;
  onComplete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  countdownDate,
  onComplete,
}) => {
  const getTimeLeft = () => {
    const targetDate = new Date(countdownDate);
    return Math.max(0, Math.floor((targetDate.getTime() - Date.now()) / 1000));
  };
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  useEffect(() => {
    setTimeLeft(getTimeLeft());
  }, [countdownDate]);
  return (
    <View className="flex-row bg-light-dark items-center justify-center pt-2">
      <CountDown
        until={timeLeft} 
        onFinish={onComplete}
        digitStyle={{ backgroundColor: "#A27B5C" }}
        digitTxtStyle={{ color: "white", fontSize: 14 }}
        timeLabels={{ d: "D", h: "H", m: "M", s: "S" }}
        timeToShow={["D", "H", "M", "S"]}
        separatorStyle={{ color: "white" }}
        timeLabelStyle={{color:'white', fontSize: 12}}
        showSeparator={false}
      />
    </View>
  );
};

export default CountdownTimer;
