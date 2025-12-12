import { Document, Page, Text, View } from "@react-pdf/renderer";

import { type MatchFormValues } from "@/app/[locale]/(main)/match/MatchForm";
import Footer from "@/app/[locale]/(main)/match/components/pdf/Footer";
import Header from "@/app/[locale]/(main)/match/components/pdf/Header";
import InfoTable from "@/app/[locale]/(main)/match/components/pdf/InfoTable";
import Team from "@/app/[locale]/(main)/match/components/pdf/Team";

import { styles } from "./pdf/styles";

interface IProps {
  data: MatchFormValues;
}

export const FeuilleMatchPdf = ({ data }: IProps) => {
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

        {/* Main Content: Two Columns for Teams */}
        <View
          style={{
            width: "100%",
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Team
            team={"A"}
            boards={boards}
            teamPlayers={data.team1_players}
            teamName={data.team1}
          />

          <Team
            team={"B"}
            boards={boards}
            teamPlayers={data.team2_players}
            teamName={data.team2}
          />
        </View>

        <View
          style={{
            marginTop: 50,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Text>Capitaine A</Text>
          <Text>Arbitre</Text>
          <Text>Capitaine B</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};
