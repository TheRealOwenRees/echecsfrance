import { Document, Font, Page, Text, View } from "@react-pdf/renderer";

import { type MatchFormValues } from "@/app/[locale]/(main)/match/MatchForm";
import Header from "@/app/[locale]/(main)/match/components/pdf/Header";
import InfoTable from "@/app/[locale]/(main)/match/components/pdf/InfoTable";

import { styles } from "./pdf/styles";

// Register fonts if needed (optional)
// Font.register({ family: 'Roboto', src: '...' });

interface PdfProps {
  data: MatchFormValues;
}

export const FeuilleMatchPdf = ({ data }: PdfProps) => {
  const boardsCount = Math.max(
    data.team1_players?.length || 0,
    data.team2_players?.length || 0,
  );
  const boards = Array.from({ length: boardsCount });

  return (
    <Document>
      <Page size="A4" orientation={"landscape"} style={styles.page}>
        <Header />

        <View style={{ width: "75%", marginTop: 20, marginLeft: 100 }}>
          <Text style={{ fontWeight: "bold", fontSize: 14, marginLeft: 100 }}>
            {data.competition}
          </Text>
          <InfoTable date={data.date} lieu={data.lieu} ronde={data.ronde} />
        </View>

        {/*Team Container*/}
        <View
          style={{
            width: "90%",
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {/*Team Headers*/}
          <View style={{ border: "1px solid black" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                fontSize: 8,
              }}
            >
              <Text>CLUB RECEVANT (ayant les blancs sur l'échiquier 1)</Text>
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
              <Text>{data.team1}</Text>
              <Text>2</Text>
            </View>
          </View>

          <View style={{ border: "1px solid black" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                fontSize: 8,
              }}
            >
              <Text>
                CLUB SE DEPLACANT ( ayant les noirs sur l'échiquier 1)
              </Text>
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
              <Text>{data.team2}</Text>
              <Text>2</Text>
            </View>
          </View>
        </View>

        {/*Board Header Container*/}
        <View
          style={{
            width: "90%",
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={styles.boardHeaderRow}>
            <Text>Ech.</Text>
            <Text>Nom</Text>
            <Text>Code FFE</Text>
            <Text>ELO</Text>
            <Text>Result</Text>
          </View>

          <View style={styles.boardHeaderRow}>
            <Text>Ech.</Text>
            <Text>Nom</Text>
            <Text>Code FFE</Text>
            <Text>ELO</Text>
            <Text>Result</Text>
          </View>
        </View>

        {/*Boards Container*/}
        <View
          style={{
            width: "90%",
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "column" }}>
            {boards.map((_, i) => (
              <View key={`team1-board-${i}`} style={{ flexDirection: "row" }}>
                <Text>
                  {`${i + 1}`} {i === 0 || i % 2 == 0 ? "B" : "N"}
                </Text>
                <Text>{data.team1_players[i]?.name || ""}</Text>
                <Text>{data.team1_players[i]?.nrFFE || ""}</Text>
                <Text>{data.team1_players[i]?.elo || ""}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "column" }}>
            {boards.map((_, i) => (
              <View key={`team2-board-${i}`} style={{ flexDirection: "row" }}>
                <Text>
                  {`${i + 1}`} {i === 0 || i % 2 == 0 ? "N" : "B"}
                </Text>
                <Text>{data.team2_players[i]?.name || ""}</Text>
                <Text>{data.team2_players[i]?.nrFFE || ""}</Text>
                <Text>{data.team2_players[i]?.elo || ""}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Table Header */}
        {/*<View style={styles.headerRow}>*/}
        {/*  <Text style={styles.cellSmall}>Ech.</Text>*/}
        {/*  <Text style={styles.cell}>Noms Prénoms (A)</Text>*/}
        {/*  <Text style={styles.cellSmall}>Elo</Text>*/}
        {/*  <Text style={styles.cellSmall}>Res.</Text>*/}
        {/*  <Text style={styles.cell}>Noms Prénoms (B)</Text>*/}
        {/*  <Text style={styles.cellSmall}>Elo</Text>*/}
        {/*</View>*/}

        {/* Table Rows */}
        {/*{boards.map((_, i) => (*/}
        {/*  <View key={i} style={styles.row}>*/}
        {/*    <Text style={styles.cellSmall}>{i + 1}</Text>*/}
        {/*    <Text style={styles.cell}>*/}
        {/*      {data.team1_players?.[i]?.name || ""}*/}
        {/*    </Text>*/}
        {/*    <Text style={styles.cellSmall}>*/}
        {/*      {data.team1_players?.[i]?.elo || ""}*/}
        {/*    </Text>*/}
        {/*    <Text style={styles.cellSmall}></Text> /!* Result placeholder *!/*/}
        {/*    <Text style={styles.cell}>*/}
        {/*      {data.team2_players?.[i]?.name || ""}*/}
        {/*    </Text>*/}
        {/*    <Text style={styles.cellSmall}>*/}
        {/*      {data.team2_players?.[i]?.elo || ""}*/}
        {/*    </Text>*/}
        {/*  </View>*/}
        {/*))}*/}

        {/*<View*/}
        {/*  style={{*/}
        {/*    marginTop: 50,*/}
        {/*    flexDirection: "row",*/}
        {/*    justifyContent: "space-around",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Text>Capitaine A</Text>*/}
        {/*  <Text>Arbitre</Text>*/}
        {/*  <Text>Capitaine B</Text>*/}
        {/*</View>*/}
      </Page>
    </Document>
  );
};
