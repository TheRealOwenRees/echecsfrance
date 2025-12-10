// import React from 'react';
// import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
// import { MatchFormValues } from '@/app/[locale]/(main)/match/components/MatchForm'; // Adjust path
//
// // Register fonts if needed (optional)
// // Font.register({ family: 'Roboto', src: '...' });
//
// const styles = StyleSheet.create({
//   page: { flexDirection: 'column', padding: 30, fontSize: 10 },
//   header: { marginBottom: 20, textAlign: 'center' },
//   title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
//   section: { margin: 10, padding: 10, flexGrow: 1 },
//   row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', alignItems: 'center', height: 24 },
//   cell: { flex: 1, padding: 2 },
//   cellSmall: { width: 40, padding: 2, borderLeftWidth: 1, borderLeftColor: '#000' },
//   headerRow: { flexDirection: 'row', backgroundColor: '#E4E4E4', borderBottomWidth: 1, borderBottomColor: '#000', height: 30, alignItems: 'center' },
// });
//
// interface PdfProps {
//   data: MatchFormValues;
// }
//
// export const FeuilleMatchPdf = ({ data }: PdfProps) => {
//   // Determine max boards based on team size, default to 4 or 8
//   const boardsCount = Math.max(data.team1_players?.length || 0, data.team2_players?.length || 0) || 8;
//   const boards = Array.from({ length: boardsCount });
//
//   return (
//     <Document>
//       <Page size="A4" style={styles.page}>
//         <View style={styles.header}>
//           <Text style={styles.title}>FEUILLE DE MATCH INTERCLUBS</Text>
//           <Text>Competition: {data.competition} - Groupe: A - Ronde: {data.ronde}</Text>
//           <Text>Lieu: {data.lieu} - Date: {data.date ? new Date(data.date).toLocaleDateString('fr-FR') : ''}</Text>
//         </View>
//
//         {/* Team Headers */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
//           <View style={{ width: '45%' }}>
//             <Text style={{ fontWeight: 'bold' }}>Equipe A: {data.team1}</Text>
//           </View>
//           <View style={{ width: '45%' }}>
//             <Text style={{ fontWeight: 'bold' }}>Equipe B: {data.team2}</Text>
//           </View>
//         </View>
//
//         {/* Table Header */}
//         <View style={styles.headerRow}>
//           <Text style={styles.cellSmall}>Ech.</Text>
//           <Text style={styles.cell}>Noms Prénoms (A)</Text>
//           <Text style={styles.cellSmall}>Elo</Text>
//           <Text style={styles.cellSmall}>Res.</Text>
//           <Text style={styles.cell}>Noms Prénoms (B)</Text>
//           <Text style={styles.cellSmall}>Elo</Text>
//         </View>
//
//         {/* Table Rows */}
//         {boards.map((_, i) => (
//           <View key={i} style={styles.row}>
//             <Text style={styles.cellSmall}>{i + 1}</Text>
//             <Text style={styles.cell}>{data.team1_players?.[i]?.name || ''}</Text>
//             <Text style={styles.cellSmall}>{data.team1_players?.[i]?.elo || ''}</Text>
//             <Text style={styles.cellSmall}></Text> {/* Result placeholder */}
//             <Text style={styles.cell}>{data.team2_players?.[i]?.name || ''}</Text>
//             <Text style={styles.cellSmall}>{data.team2_players?.[i]?.elo || ''}</Text>
//           </View>
//         ))}
//
//         <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-around' }}>
//           <Text>Capitaine A</Text>
//           <Text>Arbitre</Text>
//           <Text>Capitaine B</Text>
//         </View>
//       </Page>
//     </Document>
//   );
// };
