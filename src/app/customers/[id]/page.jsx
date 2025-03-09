import { getCustomerById } from "@/lib/customer"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
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
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { formatDate } from "@/utils/functions"

export default async function CustomerDetailPage({ params }) {
    const id = (await params).id
    const customer = await getCustomerById(id)

    if (!customer) {
        return notFound()
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto py-10 px-4 sm:px-6">
                {/* Header with glass effect */}
                <div className="relative mb-10 p-6 rounded-xl bg-background backdrop-blur-sm border shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="border"
                                >
                                    <ArrowLeft className="h-5 w-5 text-gray-300" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-400">
                                    {customer.name}
                                </h1>
                                <div className="flex items-center mt-2">
                                    <Badge variant="outline" className="bg-[#2a2d3e] text-[#a2a7b9] border-[#3a3f52]">
                                        {customer.type}
                                    </Badge>
                                    {customer.visitFactory && (
                                        <Badge variant="outline" className="ml-2 bg-[#2a3546] text-[#7eb6f6] border-[#3a4d6e]">
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

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Basic Information */}
                    <Card className="overflow-hidden">
                        <CardHeader className="border-b bg-secondary/20 pb-4">
                            <div className="flex items-center">
                                <User className="h-5 w-5 mr-2 text-[#7eb6f6]" />
                                <h2 className="text-xl font-semibold text-gray-100">Basic Information</h2>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-[#2a3546] flex items-center justify-center mr-4 flex-shrink-0">
                                        <Users className="h-5 w-5 text-[#7eb6f6]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a2a7b9] mb-1">Customer Type</p>
                                        <p className="text-lg font-medium">{customer.type}</p>
                                    </div>
                                </div>

                                <Separator className="bg-[#2a2f3d]" />

                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-[#2a3546] flex items-center justify-center mr-4 flex-shrink-0">
                                        <Phone className="h-5 w-5 text-[#7eb6f6]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a2a7b9] mb-1">Mobile</p>
                                        <p className="text-lg font-medium">{customer.mobile}</p>
                                    </div>
                                </div>

                                {customer.partnerMobile && (
                                    <>
                                        <Separator className="bg-[#2a2f3d]" />
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-[#2a3546] flex items-center justify-center mr-4 flex-shrink-0">
                                                <Users className="h-5 w-5 text-[#7eb6f6]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-[#a2a7b9] mb-1">Partner Mobile</p>
                                                <p className="text-lg font-medium">{customer.partnerMobile}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card className="overflow-hidden bg-gradient-to-br from-[#1a1d25] to-[#252836] border-[#2a2f3d] shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]">
                        <CardHeader className="bg-gradient-to-r from-[#252836] to-[#1e2130] border-b border-[#2a2f3d] pb-4">
                            <div className="flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-[#a2d8ff]" />
                                <h2 className="text-xl font-semibold text-gray-100">Documents</h2>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6">
                                {customer.panCard && (
                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-full bg-[#2a3546] flex items-center justify-center mr-4 flex-shrink-0">
                                            <CreditCard className="h-5 w-5 text-[#a2d8ff]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#a2a7b9] mb-1">PAN Card</p>
                                            <p className="text-lg font-medium tracking-wider">{customer.panCard}</p>
                                        </div>
                                    </div>
                                )}

                                {customer.aadhar && (
                                    <>
                                        <Separator className="bg-[#2a2f3d]" />
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-[#2a3546] flex items-center justify-center mr-4 flex-shrink-0">
                                                <CreditCard className="h-5 w-5 text-[#a2d8ff]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-[#a2a7b9] mb-1">Aadhar Number</p>
                                                <p className="text-lg font-medium tracking-wider">{customer.aadhar}</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {customer.gstNumber && (
                                    <>
                                        <Separator className="bg-[#2a2f3d]" />
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-[#2a3546] flex items-center justify-center mr-4 flex-shrink-0">
                                                <Building className="h-5 w-5 text-[#a2d8ff]" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-[#a2a7b9] mb-1">GST Number</p>
                                                <p className="text-lg font-medium tracking-wider">{customer.gstNumber}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card className="overflow-hidden bg-gradient-to-br from-[#1a1d25] to-[#252836] border-[#2a2f3d] shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] md:col-span-2">
                        <CardHeader className="bg-gradient-to-r from-[#252836] to-[#1e2130] border-b border-[#2a2f3d] pb-4">
                            <div className="flex items-center">
                                <MapPin className="h-5 w-5 mr-2 text-[#ff9580]" />
                                <h2 className="text-xl font-semibold text-gray-100">Location</h2>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-[#3d2a35] flex items-center justify-center mr-4 flex-shrink-0">
                                        <Building className="h-5 w-5 text-[#ff9580]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a2a7b9] mb-1">City</p>
                                        <p className="text-lg font-medium">{customer.city}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-[#3d2a35] flex items-center justify-center mr-4 flex-shrink-0">
                                        <Landmark className="h-5 w-5 text-[#ff9580]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a2a7b9] mb-1">District</p>
                                        <p className="text-lg font-medium">{customer.district}</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-[#3d2a35] flex items-center justify-center mr-4 flex-shrink-0">
                                        <Map className="h-5 w-5 text-[#ff9580]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a2a7b9] mb-1">State</p>
                                        <p className="text-lg font-medium">{customer.state}</p>
                                    </div>
                                </div>

                                <div className="flex items-start md:col-span-2">
                                    <div className="w-10 h-10 rounded-full bg-[#3d2a35] flex items-center justify-center mr-4 flex-shrink-0">
                                        <MapPin className="h-5 w-5 text-[#ff9580]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#a2a7b9] mb-1">Address</p>
                                        <p className="text-lg font-medium whitespace-pre-wrap">{customer.address}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Visit Details */}
                    <Card className="overflow-hidden bg-gradient-to-br from-[#1a1d25] to-[#252836] border-[#2a2f3d] shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px] md:col-span-2">
                        <CardHeader className="bg-gradient-to-r from-[#252836] to-[#1e2130] border-b border-[#2a2f3d] pb-4">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-[#a2ff85]" />
                                <h2 className="text-xl font-semibold text-gray-100">Factory Visit</h2>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex items-center">
                                {customer.visitFactory ? (
                                    <div className="flex items-center p-4 bg-[#1e2d1e] rounded-lg border border-[#2a3d2a] animate-pulse">
                                        <div className="w-12 h-12 rounded-full bg-[#2a3d2a] flex items-center justify-center mr-4">
                                            <Calendar className="h-6 w-6 text-[#a2ff85]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#a2a7b9] mb-1">Scheduled Visit Date</p>
                                            <p className="text-xl font-medium text-[#a2ff85]">{formatDate(customer.visitFactory)}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center p-4 bg-[#2d1e1e] rounded-lg border border-[#3d2a2a]">
                                        <div className="w-12 h-12 rounded-full bg-[#3d2a2a] flex items-center justify-center mr-4">
                                            <Calendar className="h-6 w-6 text-[#ff8585]" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-[#a2a7b9] mb-1">Visit Status</p>
                                            <p className="text-xl font-medium text-[#ff8585]">No visit scheduled</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

