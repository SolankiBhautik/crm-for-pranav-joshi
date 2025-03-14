import { getCustomerById } from "@/lib/customer"
import { getCustomerOrders } from "@/lib/order"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    Edit,
    Calendar,
    User,
    Phone,
    Users,
    FileText,
    MapPin,
    Building,
    CreditCard,
    Landmark,
    Map,
    Package,
    Receipt,
    Clock,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDate } from "@/utils/functions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function CustomerDetailPage({ params }) {
    const id = params.id
    const customer = await getCustomerById(id)
    const orders = await getCustomerOrders(id)

    if (!customer) {
        return notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-10 px-4 sm:px-6">
                {/* Header */}
                <div className="relative mb-10 p-6 rounded-xl bg-card border shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="outline" size="icon">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{customer.name}</h1>
                                <div className="flex items-center mt-2">
                                    <Badge variant="secondary">{customer.type}</Badge>
                                    {customer.visitFactory && (
                                        <Badge variant="outline" className="ml-2">
                                            <Calendar className="mr-1 h-3 w-3" />
                                            Visit Scheduled
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Link href={`/customers/edit/${id}`} prefetch={true}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Customer
                            </Button>
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="details" className="mb-8">
                    <TabsList className="grid w-full md:w-auto grid-cols-2 h-auto">
                        <TabsTrigger className="p-3" value="details">Customer Details</TabsTrigger>
                        <TabsTrigger className="p-3" value="orders">Orders</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                        <div className="grid gap-8 md:grid-cols-2">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader className="border-b bg-muted/50 pb-4">
                                    <div className="flex items-center">
                                        <User className="h-5 w-5 mr-2 text-primary" />
                                        <h2 className="text-xl font-semibold">Basic Information</h2>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid gap-6">
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <Users className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Customer Type</p>
                                                <p className="text-lg font-medium">{customer.type}</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <Phone className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Mobile</p>
                                                <p className="text-lg font-medium">{customer.mobile}</p>
                                            </div>
                                        </div>

                                        {customer.partnerMobile && (
                                            <>
                                                <Separator />
                                                <div className="flex items-start">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                        <Users className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-1">Partner Mobile</p>
                                                        <p className="text-lg font-medium">{customer.partnerMobile}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Documents */}
                            <Card>
                                <CardHeader className="border-b bg-muted/50 pb-4">
                                    <div className="flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-primary" />
                                        <h2 className="text-xl font-semibold">Documents</h2>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid gap-6">
                                        {customer.panCard && (
                                            <div className="flex items-start">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                    <CreditCard className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">PAN Card</p>
                                                    <p className="text-lg font-medium tracking-wider">{customer.panCard}</p>
                                                </div>
                                            </div>
                                        )}

                                        {customer.aadhar && (
                                            <>
                                                <Separator />
                                                <div className="flex items-start">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                        <CreditCard className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-1">Aadhar Number</p>
                                                        <p className="text-lg font-medium tracking-wider">{customer.aadhar}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {customer.gstNumber && (
                                            <>
                                                <Separator />
                                                <div className="flex items-start">
                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                        <Building className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-muted-foreground mb-1">GST Number</p>
                                                        <p className="text-lg font-medium tracking-wider">{customer.gstNumber}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location */}
                            <Card className="md:col-span-2">
                                <CardHeader className="border-b bg-muted/50 pb-4">
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                                        <h2 className="text-xl font-semibold">Location</h2>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <Building className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">City</p>
                                                <p className="text-lg font-medium">{customer.city}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <Landmark className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">District</p>
                                                <p className="text-lg font-medium">{customer.district}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <Map className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">State</p>
                                                <p className="text-lg font-medium">{customer.state}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start md:col-span-2">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">Address</p>
                                                <p className="text-lg font-medium whitespace-pre-wrap">{customer.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Visit Details */}
                            <Card className="md:col-span-2">
                                <CardHeader className="border-b bg-muted/50 pb-4">
                                    <div className="flex items-center">
                                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                                        <h2 className="text-xl font-semibold">Factory Visit</h2>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="flex items-center">
                                        {customer.visitFactory ? (
                                            <div className="flex items-center p-4 bg-primary/5 rounded-lg border">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                                                    <Calendar className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Scheduled Visit Date</p>
                                                    <p className="text-xl font-medium text-primary">{formatDate(customer.visitFactory)}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center p-4 bg-destructive/5 rounded-lg border">
                                                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mr-4">
                                                    <Calendar className="h-6 w-6 text-destructive" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Visit Status</p>
                                                    <p className="text-xl font-medium text-destructive">No visit scheduled</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="orders">
                        <Card>
                            <CardHeader className="border-b bg-muted/50 pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Package className="h-5 w-5 mr-2 text-primary" />
                                        <h2 className="text-xl font-semibold">Orders</h2>
                                    </div>
                                    <Link href={`/customers/order/${id}`}>
                                        <Button size="sm">Add New Order</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[500px] w-full">
                                    <Table>
                                        <TableHeader className="sticky top-0 bg-card z-10">
                                            <TableRow>
                                                <TableHead className="w-[50px]">Sr.</TableHead>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Size</TableHead>
                                                <TableHead>Grade</TableHead>
                                                <TableHead>Box</TableHead>
                                                <TableHead>Sq.Ft</TableHead>
                                                <TableHead>Rate</TableHead>
                                                <TableHead>Bill Rate</TableHead>
                                                <TableHead>Insu.</TableHead>
                                                <TableHead>Tax</TableHead>
                                                <TableHead>Bill Amount</TableHead>
                                                <TableHead>Cash Rate</TableHead>
                                                <TableHead>Cash Amount</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {orders && orders.length > 0 ? (
                                                orders.map((order, index) => (
                                                    <TableRow key={order.id || index}>
                                                        <TableCell>{order.srNo || index + 1}</TableCell>
                                                        <TableCell>{order.name}</TableCell>
                                                        <TableCell>{order.size}</TableCell>
                                                        <TableCell>{order.grade}</TableCell>
                                                        <TableCell>{order.boxNumber}</TableCell>
                                                        <TableCell>{order.sqFt}</TableCell>
                                                        <TableCell>{order.tpRate}</TableCell>
                                                        <TableCell>{order.billRate}</TableCell>
                                                        <TableCell>{order.insurance}</TableCell>
                                                        <TableCell>{order.tax}</TableCell>
                                                        <TableCell>{order.billAmount}</TableCell>
                                                        <TableCell>{order.cashRate}</TableCell>
                                                        <TableCell>{order.amount}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Link href={`/orders/${order.id}`}>
                                                                <Button variant="ghost" size="sm">
                                                                    View
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={14} className="text-center h-24 text-muted-foreground">
                                                        No orders found for this customer
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </CardContent>
                            {orders && orders.length > 0 && (
                                <CardFooter className="border-t bg-muted/20 py-4 flex justify-between">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            Last order: {formatDate(orders[0].created_at || new Date())}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium">Total Orders: {orders.length}</div>
                                </CardFooter>
                            )}
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

