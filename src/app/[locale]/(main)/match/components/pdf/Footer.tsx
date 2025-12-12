import { Text, View } from "@react-pdf/renderer";

import { styles } from "@/app/[locale]/(main)/match/components/pdf/styles";

const Footer = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>
      Generated at https://echecsfrance.com/match
    </Text>
    ;
  </View>
);

export default Footer;
