import { Document, Page, Text, View } from "@react-pdf/renderer";

import { type MatchFormValues } from "@/app/[locale]/(main)/match/MatchForm";
import Footer from "@/app/[locale]/(main)/match/components/pdf/Footer";
import Header from "@/app/[locale]/(main)/match/components/pdf/Header";
import InfoTable from "@/app/[locale]/(main)/match/components/pdf/InfoTable";
import MatchSignaturePoints from "@/app/[locale]/(main)/match/components/pdf/MatchSignaturePoints";
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

        <View style={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}>
          <InfoTable
            date={data.date}
            lieu={data.lieu}
            ronde={data.ronde}
            competition={data.competition}
          />
        </View>

        {/* Main Content: Two Columns for Teams */}
        <View
          style={{
            width: "100%",
            marginTop: 5,
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
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "space-around",
            width: "100%",
          }}
        >
          <MatchSignaturePoints>
            Nom et signature du Capitaine A
          </MatchSignaturePoints>

          <MatchSignaturePoints>
            Nom et signature du Capitaine B
          </MatchSignaturePoints>
        </View>

        <View
          style={{
            width: "75%",
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
          }}
        >
          <View style={{ width: "35%", border: "1px solid black", padding: 8 }}>
            <Text style={{ textAlign: "center" }}>
              A RENVOYER AU PLUS TARD LE LENDEMAIN DU JOUR DE LA RENCONTRE A:
            </Text>
            <Text style={{ textAlign: "center" }}>Thierry Généreau</Text>
            <Text style={{ textAlign: "center" }}>
              thierry.genereau@orange.fr
            </Text>
          </View>
          <View style={{ width: "60%", flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
                border: "1px solid black",
                height: 40,
                columnGap: 80,
                padding: 2,
              }}
            >
              <Text>Responsable de la rencontre:</Text>
              <Text style={{ marginRight: 100 }}>Signature:</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 10,
                border: "1px solid black",
                columnGap: 80,
                height: 40,
                marginTop: 5,
                padding: 2,
              }}
            >
              <Text>L'arbitre:</Text>
              <Text style={{ marginRight: 100 }}>Signature:</Text>
            </View>
          </View>
        </View>

        <Footer />
      </Page>
    </Document>
  );
};
