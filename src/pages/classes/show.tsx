import { useShow } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useParams } from "react-router";
import { AdvancedImage} from "@cloudinary/react";
import {bannerPhoto} from "@/lib/cloudinary.ts";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClassDetails } from "@/types";
import {getInitials} from "@/lib/utils.ts";

type ClassUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    image?: string | null;
};

const ClassShow = () => {
    const { id } = useParams();
    const classId = id ?? "";

    const { query } = useShow<ClassDetails>({
        resource: "classes"
    });

    const classDetails = query.data?.data;
    const { isLoading, isError } = query;

    if (isLoading || isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details" />
                <p className="state-message">
                    { isLoading ? "Loading class details..." : isError ? "Failed to load class details" : "class details not found"}
                </p>
            </ShowView>
        )
    };

    const teacherName = classDetails.teacher?.name ?? "Unknown";
    const teacherInitials = teacherName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
        teacherInitials || "NA"
    )}`;

    const studentColumns = useMemo<ColumnDef<ClassUser>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                size: 240,
                header: () => <p className="column-title">Student</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                            {row.original.image && (
                                <AvatarImage src={row.original.image} alt={row.original.name} />
                            )}
                            <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="truncate">{row.original.name}</span>
                            <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
                        </div>
                    </div>
                ),
            },
            {
                id: "details",
                size: 140,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => (
                    <ShowButton
                        resource="users"
                        recordItemId={row.original.id}
                        variant="outline"
                        size="sm"
                    >
                        View
                    </ShowButton>
                ),
            },
        ],
        []
    );

    const studentsTable = useTable<ClassUser>({
        columns: studentColumns,
        refineCoreProps: {
            resource: `classes/${classId}/users`,
            pagination: {
                pageSize: 3,
                mode: "server"
            },
            filters: {
                permanent: [
                    {
                        field: "role",
                        operator: "eq",
                        value: "student"
                    }
                ]
            }
        }
    });

    const { bannerUrl, bannerCldPubId, department, name, description, status, capacity, teacher, subject } = classDetails;

    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="classes" title="Class Details" />

            <div className="banner">
                {bannerUrl ? (
                    bannerUrl.includes("res.cloudinary.com") &&
                    bannerCldPubId ? (
                        <AdvancedImage
                        cldImg ={bannerPhoto(
                            bannerCldPubId ?? "",
                            name
                        )}
                        alt="class banner"
                        />
                    ) : (
                        <img
                            src={bannerUrl}
                            alt="class banner"
                            loading="lazy"
                        />
                    )
                ) : (
                    <div className="placeholder" />
                )}
            </div>

            <Card className="details-card">
                <div>
                    <div className="details-header">
                        <div>
                            <h1>{name}</h1>
                            <p>{description}</p>
                        </div>

                        <div>
                            <Badge variant="outline">{capacity}</Badge>
                            <Badge
                                variant={
                                    status === "active" ? "default" : "secondary"
                                }
                                data-status={status}
                            >
                                {status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="instructor">
                            <p>🙍Instructor</p>
                            <div>
                                <img src={teacher?.image ?? placeholderUrl} alt={teacherName}/>
                                <div>
                                    <p>{teacherName}</p>
                                    <p>{teacher?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="department">
                            <p>🏛️ Department</p>

                            <div>
                                <p>{classDetails.department?.name}</p>
                                <p>{classDetails.department?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="subject">
                    <p>📚 Subject</p>

                    <div>
                        <Badge variant="outline">
                            Code: <span>{subject?.code}</span>
                        </Badge>
                        <p>{subject?.name}</p>
                        <p>{subject?.description}</p>
                    </div>
                </div>

                <Separator />

                <div className="join">
                    <h2>🎓 Join Class</h2>

                    <ol>
                        <li>Ask your teacher for the invite code.</li>
                        <li>Click on &quot;Join Class&quot; button.</li>
                        <li>Paste the code and click &quot;Join&quot;</li>
                    </ol>
                </div>
                <Button size="lg" className="w-full">
                    Join Class
                </Button>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Enrolled Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable table={studentsTable} />
                </CardContent>
            </Card>
        </ShowView>
    )
}
export default ClassShow
