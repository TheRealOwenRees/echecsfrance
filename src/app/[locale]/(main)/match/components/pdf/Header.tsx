import { Text, View } from "@react-pdf/renderer";

import { styles } from "@/app/[locale]/(main)/match/components/pdf/styles";

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.title}>FEDERATION FRANCAISE DES ECHECS</Text>
    <Text style={styles.title}>FEUILLE DE MATCH</Text>
    <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 2 }}>
      AGREE PAR LE MINISTERE DE LA JEUNESSE DES SPORTS ET DES LOISIRS
    </Text>
    <Text style={{ fontSize: 8, fontWeight: "bold", marginBottom: 2 }}>
      MEMBRE FONDATEUR DE LA FEDERATION INTERNATIONALE DES ECHECS
    </Text>
  </View>
);

export default Header;
