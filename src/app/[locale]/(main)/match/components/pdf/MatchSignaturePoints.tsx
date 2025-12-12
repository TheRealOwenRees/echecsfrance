import { Text, View } from "@react-pdf/renderer";

interface IProps {
  children: string;
}

const MatchSignaturePoints = ({ children }: IProps) => (
  <View
    style={{
      width: "48%",
      flexDirection: "row",
      justifyContent: "space-around",
    }}
  >
    <View
      style={{
        border: "1px solid black",
        padding: 5,
      }}
    >
      <Text>Réserves:</Text>
      <View style={{ marginTop: 5 }}>
        <Text>OUI</Text>
        <Text>NON</Text>
      </View>
    </View>
    <Text>{children}</Text>
    <View
      style={{
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        <Text>Points de Parties</Text>
        <View
          style={{
            border: "1px solid black",
            paddingVertical: 10,
            paddingHorizontal: 15,
            marginLeft: "auto",
          }}
        ></View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>Points de Match</Text>
        <View
          style={{
            border: "1px solid black",
            paddingVertical: 10,
            paddingHorizontal: 15,
            marginLeft: "auto",
          }}
        ></View>
      </View>
    </View>
  </View>
);

export default MatchSignaturePoints;
