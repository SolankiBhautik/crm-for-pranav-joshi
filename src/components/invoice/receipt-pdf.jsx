import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles for the PDF
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
    header: { marginBottom: 20, textAlign: 'center' },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    customerInfo: { marginBottom: 20, borderWidth: 1, padding: 10, borderRadius: 4, },
    infoRow: { flexDirection: 'row', gap: 2, marginBottom: 5 },
    infoLabel: { fontWeight: 'bold' },
    section: { marginBottom: 20 },
    companyTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
    table: { borderWidth: 1, marginBottom: 10, fontSize: 8, borderRadius: 4, overflow: 'hidden' },
    tableHeader: { backgroundColor: '#f5f5f5', flexDirection: 'row', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#000', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#000', fontSize: 8 },
    tableCell: { padding: 5, flex: 1, textAlign: 'center', fontSize: 8 },
    tableCellHeader: { padding: 5, flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 8 },
    summaryRow: { flexDirection: 'row', backgroundColor: '#e0e0e0', fontSize: 8, fontWeight: 'bold', },
    LastSummaryRow: { flexDirection: 'row', backgroundColor: '#e0e0e0', fontSize: 8, fontWeight: 'bold', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
    finalSummaryRow: { flexDirection: 'row', backgroundColor: '#e0e0e0', fontSize: 8, fontWeight: 'bold' },
    summaryCell: { padding: 5, textAlign: 'center', fontSize: 8 },
    highlight: { fontSize: 14, fontWeight: 'bold', margin: 10, borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: '#000', paddingBottom: 4, width: 'auto' },
    totalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
        borderWidth: 1,
    },
    amountContainer: {
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    amount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
});

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
    return baseAmount + insuAmount + taxAmount;
};

const calculateCashRate = (order) => {
    return Number(order.rate || 0) - Number(order.billRate || 0);
};

const calculateCashAmount = (order) => {
    const boxNumber = Number(order.boxNumber || 0);
    const sqft = Number(order.sqft || 0);
    const cashRate = Number(order.rate || 0) - Number(order.billRate || 0);
    return boxNumber * sqft * cashRate;
};

const ReceiptPDF = ({ customer, ordersByCompany, customerCompanies }) => {
    let totalBox = 0;
    let totalBillAmount = 0;
    let totalCashAmount = 0;

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Order Receipt</Text>
                </View>

                <View style={styles.customerInfo}>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Name:</Text><Text>{customer.name}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Type:</Text><Text>{customer.type}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Mobile No.:</Text><Text>{customer.mobile}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>City:</Text><Text>{customer.city}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>District:</Text><Text>{customer.district}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>State:</Text><Text>{customer.state}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Address:</Text><Text>{customer.address}</Text></View>
                    <View style={styles.infoRow}><Text style={styles.infoLabel}>Date:</Text><Text>{new Date(customer.date).toLocaleString()}</Text></View>
                </View>

                {customerCompanies.map(company => {
                    const companyOrders = ordersByCompany[company.id] || [];
                    const companyTotals = companyOrders.reduce((acc, order) => {
                        const billAmount = calculateBillAmount(order);
                        const cashRate = calculateCashRate(order);
                        const cashAmount = calculateCashAmount(order);
                        return {
                            totalBox: acc.totalBox + Number(order.boxNumber || 0),
                            totalBillAmount: acc.totalBillAmount + billAmount,
                            totalCashAmount: acc.totalCashAmount + cashAmount,
                        };
                    }, { totalBox: 0, totalBillAmount: 0, totalCashAmount: 0 });

                    totalBox += companyTotals.totalBox;
                    totalBillAmount += companyTotals.totalBillAmount;
                    totalCashAmount += companyTotals.totalCashAmount;

                    return (
                        <View key={company.id} style={styles.section}>
                            <Text style={styles.companyTitle}>{company.name}</Text>
                            <View style={styles.table}>
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
                                {companyOrders.map((order, index) => (
                                    <View key={order.id} style={styles.tableRow}>
                                        <Text style={styles.tableCell}>{index + 1}</Text>
                                        <Text style={styles.tableCell}>{order.name || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{order.size || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{order.grade || 'N/A'}</Text>
                                        <Text style={styles.tableCell}>{order.boxNumber || 0}</Text>
                                        <Text style={styles.tableCell}>{order.sqft || '0'}</Text>
                                        <Text style={styles.tableCell}>{order.rate || '0'}</Text>
                                        <Text style={styles.tableCell}>{order.billRate || '0'}</Text>
                                        <Text style={styles.tableCell}>{order.insu || '0'}</Text>
                                        <Text style={styles.tableCell}>{order.tax || '0'}</Text>
                                        <Text style={styles.tableCell}>{calculateBillAmount(order).toFixed(2)}</Text>
                                        <Text style={styles.tableCell}>{calculateCashRate(order).toFixed(2)}</Text>
                                        <Text style={styles.tableCell}>{calculateCashAmount(order).toFixed(2)}</Text>
                                    </View>
                                ))}
                                {/* Company Summary */}
                                <View style={styles.summaryRow}>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}>{companyTotals.totalBox}</Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}>{companyTotals.totalBillAmount.toFixed(2)}</Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}>{companyTotals.totalCashAmount.toFixed(2)}</Text>
                                </View>
                                <View style={styles.LastSummaryRow}> 
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}></Text>
                                    <Text style={styles.tableCell}>{(companyTotals.totalBillAmount + companyTotals.totalCashAmount).toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}

                <View style={styles.totalSection}>
                    <View style={styles.amountContainer}>
                        <Text style={styles.title}>Total Bill</Text>
                        <Text style={styles.amount}>{totalBillAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={styles.title}>Total Cash</Text>
                        <Text style={styles.amount}>{totalCashAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={styles.title}>Grand Total</Text>
                        <Text style={styles.amount}>{(totalBillAmount + totalCashAmount).toFixed(2)}</Text>
                    </View>
                </View>

            </Page>
        </Document>
    );
};

export default ReceiptPDF;