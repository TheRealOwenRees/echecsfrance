import { Text, View } from "@react-pdf/renderer";

import { styles } from "./styles";

interface IProps {
  date: Date;
  lieu: string;
  ronde: number;
}

const InfoTable = ({ date, lieu, ronde }: IProps) => (
  <View style={styles.infoTable}>
    {/* Header Row */}
    <View style={styles.infoRow}>
      <Text style={styles.infoCellHeader}>DATE</Text>
      <Text style={styles.infoCellHeader}>LIEU</Text>
      <Text style={[styles.infoCellHeader, styles.lastCell]}>RONDE</Text>
    </View>

    {/* Data Row */}
    <View style={styles.infoRow}>
      <Text style={styles.infoCell}>
        {date ? new Date(date).toLocaleDateString("fr-FR") : " "}
      </Text>
      <Text style={styles.infoCell}>{lieu || " "}</Text>
      <Text style={[styles.infoCell, styles.lastCell]}>{ronde || " "}</Text>
    </View>
  </View>
);

export default InfoTable;
