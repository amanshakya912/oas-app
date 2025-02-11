import { Text, View } from "react-native"

const CurrentAuctions = () => {
    return (
        <>
            <View className="p-4">
                {[...Array(50)].map((_, i) => (
                <Text key={i} className="text-white">Item {i + 1}</Text>
                ))}
            </View>
        </>
    )
}

export default CurrentAuctions