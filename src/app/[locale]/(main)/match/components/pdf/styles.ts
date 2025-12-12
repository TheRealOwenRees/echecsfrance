import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: { flexDirection: "column", padding: 30, fontSize: 10 },
  header: { marginBottom: 10, textAlign: "center" },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 2 },
  section: { margin: 10, padding: 10, flexGrow: 1 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    alignItems: "center",
    height: 24,
  },
  cell: { flex: 1, padding: 2 },
  cellSmall: {
    width: 40,
    padding: 2,
    borderLeftWidth: 1,
    borderLeftColor: "#000",
  },
  boardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid black",
  },
  infoTable: {
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 5,
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
  },
  infoCellHeader: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    fontWeight: "bold",
    // backgroundColor: "#E4E4E4",
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    fontSize: 10,
  },
  infoCell: {
    flex: 1,
    padding: 5,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#000",
    fontSize: 10,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  footer: {
    position: "absolute",
    zIndex: 1,
    bottom: 40,
    left: 0,
    right: 0,
    fontSize: 8,
  },
  footerText: {
    marginTop: 2,
    textAlign: "center",
  },
});
