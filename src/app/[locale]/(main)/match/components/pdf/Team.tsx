import { Text, View } from "@react-pdf/renderer";

import { styles } from "@/app/[locale]/(main)/match/components/pdf/styles";
import { Player } from "@/interfaces";

const teamAHeaderText = "CLUB RECEVANT (Blancs échiquier 1)";
const teamBHeaderText = "CLUB SE DEPLACANT (Noirs échiquier 1)";

interface IProps {
  team: "A" | "B";
  teamName: string;
  teamPlayers: Pick<Player, "name" | "elo" | "nrFFE">[];
  boards: unknown[];
}

const Team = ({ team, teamName, teamPlayers, boards }: IProps) => {
  const calculateBoardColor = ({
    team,
    boardNumber,
  }: {
    team: "A" | "B";
    boardNumber: number;
  }) => {
    const option1 = team === "A" ? "B" : "N";
    const option2 = team === "A" ? "N" : "B";
    return boardNumber % 2 !== 0 ? option1 : option2;
  };

  return (
    <View style={{ width: "48%", flexDirection: "column" }}>
      {/* Header Info */}
      <View
        style={{
          border: "1px solid black",
          marginBottom: 5,
          padding: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            fontSize: 8,
            marginBottom: 2,
          }}
        >
          <Text>{team === "A" ? teamAHeaderText : teamBHeaderText}</Text>
          <Text>Code Club</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          <Text>{teamName}</Text>
          <Text></Text>
        </View>
      </View>

      {/* Team Board Header */}
      <View style={styles.boardHeaderRow}>
        <Text style={{ width: "10%" }}>Ech.</Text>
        <Text style={{ width: "45%" }}>Nom</Text>
        <Text style={{ width: "20%" }}>Code FFE</Text>
        <Text style={{ width: "10%" }}>ELO</Text>
        <Text style={{ width: "15%", textAlign: "center" }}>Result</Text>
      </View>

      {/* Team Players List */}
      <View style={{ flexDirection: "column" }}>
        {boards.map((_, i) => (
          <View
            key={`team1-board-${i}`}
            style={{
              flexDirection: "row",
              paddingVertical: 2,
              borderBottom: "1px solid #eee",
              alignItems: "center",
              paddingTop: 5,
              paddingBottom: 5,
            }}
          >
            <Text style={{ width: "10%" }}>
              {`${i + 1}`} {calculateBoardColor({ team, boardNumber: i + 1 })}
            </Text>
            <Text style={{ width: "45%", fontSize: 9 }}>
              {teamPlayers[i]?.name || ""}
            </Text>
            <Text style={{ width: "20%", fontSize: 9 }}>
              {teamPlayers[i]?.nrFFE || ""}
            </Text>
            <Text style={{ width: "10%", fontSize: 9 }}>
              {teamPlayers[i]?.elo || ""}
            </Text>
            <Text style={{ width: "15%" }}> </Text>
          </View>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingTop: 2,
          paddingBottom: 2,
        }}
      >
        <Text>Gain: 1</Text>
        <Text>Null: X</Text>
        <Text>Perte: 0</Text>
      </View>
    </View>
  );
};

export default Team;
