import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles for the PDF
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
    header: { marginBottom: 20, textAlign: 'center' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    customerInfo: { marginBottom: 20, borderWidth: 1, padding: 10 },
    infoRow: { flexDirection: 'row', gap: 2, marginBottom: 5 },
    infoLabel: { fontWeight: 'bold' },
    section: { marginBottom: 20 },
    companyTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
    table: { borderWidth: 1, marginBottom: 10, fontSize: 8 },
    tableHeader: { backgroundColor: '#f0f0f0', flexDirection: 'row', borderBottom: 1 },
    tableRow: { flexDirection: 'row', borderBottom: 1, fontSize: 8 },
    tableCell: { padding: 5, flex: 1, textAlign: 'center', fontSize: 8 },
    tableCellHeader: { padding: 5, flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 8 },
});

// Calculate bill amount, cash rate, and cash amount
const calculateBillAmount = (order) => {
    const boxNumber = Number(order.boxNumber || 0);
    const sqft = Number(order.sqft || 0);
    const billRate = Number(order.billRate || 0);
    const insu = Number(order.insu || 0) / 100;
    const tax = Number(order.tax || 0) / 100;
    const baseAmount = boxNumber * sqft * billRate;
    const insuAmount = baseAmount * insu;
    const subtotal = baseAmount + insuAmount;
    const taxAmount = subtotal * tax;
    return (baseAmount + insuAmount + taxAmount).toFixed(2);
};

const calculateCashRate = (order) => {
    return (Number(order.rate || 0) - Number(order.billRate || 0)).toFixed(2);
};

const calculateCashAmount = (order) => {
    const boxNumber = Number(order.boxNumber || 0);
    const sqft = Number(order.sqft || 0);
    const cashRate = Number(order.rate || 0) - Number(order.billRate || 0);
    return (boxNumber * sqft * cashRate).toFixed(2);
};

const ReceiptPDF = ({ customer, ordersByCompany, customerCompanies }) => (
    <Document>
        <Page style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Order Receipt</Text>
            </View>

            {/* Customer Information */}
            <View style={styles.customerInfo}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text>{customer.name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Aadhar:</Text>
                    <Text>{customer.aadhar}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Address:</Text>
                    <Text>{customer.address}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>City:</Text>
                    <Text>{customer.city}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>District:</Text>
                    <Text>{customer.district}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>State:</Text>
                    <Text>{customer.state}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Mobile:</Text>
                    <Text>{customer.mobile}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Partner Mobile:</Text>
                    <Text>{customer.partnerMobile || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>GST Number:</Text>
                    <Text>{customer.gstNumber || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>PAN Card:</Text>
                    <Text>{customer.panCard}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Reference:</Text>
                    <Text>{customer.reference}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Date:</Text>
                    <Text>{new Date(customer.date).toLocaleString()}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Note:</Text>
                    <Text>{customer.note}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status:</Text>
                    <Text>{customer.status}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Type:</Text>
                    <Text>{customer.type}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Total Amount:</Text>
                    <Text>₹{customer.totalAmount.toFixed(2)}</Text>
                </View>
            </View>

            {/* Company Tables */}
            {customerCompanies.map(company => (
                <View key={company.id} style={styles.section}> 
                    <Text style={styles.companyTitle}>{company.name}</Text>
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={styles.tableHeader}>
                            <Text style={styles.tableCellHeader}>Sr.</Text>
                            <Text style={styles.tableCellHeader}>Name</Text>
                            <Text style={styles.tableCellHeader}>Size</Text>
                            <Text style={styles.tableCellHeader}>Grade</Text>
                            <Text style={styles.tableCellHeader}>Box</Text>
                            <Text style={styles.tableCellHeader}>Sq.Ft</Text>
                            <Text style={styles.tableCellHeader}>Rate</Text>
                            <Text style={styles.tableCellHeader}>Bill Rate</Text>
                            <Text style={styles.tableCellHeader}>Insu.</Text>
                            <Text style={styles.tableCellHeader}>Tax</Text>
                            <Text style={styles.tableCellHeader}>Bill Amount</Text>
                            <Text style={styles.tableCellHeader}>Cash Rate</Text>
                            <Text style={styles.tableCellHeader}>Cash Amount</Text>
                        </View>
                        {/* Table Rows */}
                        {ordersByCompany[company.id].map((order, index) => (
                            <View key={order.id} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{order.srNo || index + 1}</Text>
                                <Text style={styles.tableCell}>{order.name || 'N/A'}</Text>
                                <Text style={styles.tableCell}>{order.size || 'N/A'}</Text>
                                <Text style={styles.tableCell}>{order.grade || 'N/A'}</Text>
                                <Text style={styles.tableCell}>{order.boxNumber || 0}</Text>
                                <Text style={styles.tableCell}>{order.sqft || '0'}</Text>
                                <Text style={styles.tableCell}>{order.rate || '0'}</Text>
                                <Text style={styles.tableCell}>{order.billRate || '0'}</Text>
                                <Text style={styles.tableCell}>{order.insu || '0'}</Text>
                                <Text style={styles.tableCell}>{order.tax || '0'}</Text>
                                <Text style={styles.tableCell}>{calculateBillAmount(order)}</Text>
                                <Text style={styles.tableCell}>{calculateCashRate(order)}</Text>
                                <Text style={styles.tableCell}>{calculateCashAmount(order)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            ))}
        </Page>
    </Document>
);

export default ReceiptPDF;