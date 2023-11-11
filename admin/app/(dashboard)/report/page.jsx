'use client';
import AvatarText from '@/components/Avatar';
import EditProductButton from '@/components/Button/EditProductButton';
import ImageIconProduct from '@/components/ProductImageCover';
import { Switch } from '@/components/ui/switch';
import { routes } from '@/routes';
import { getReports, updateReport } from '@/services/report.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import Link from 'next/link';

const ReportPage = () => {
    const getReportQuery = useQuery({
        queryKey: ['get-report'],
        queryFn: () => {
            return getReports();
        },
    });
    const updateReportMutation = useMutation({
        mutationFn: ({ reportId }) => {
            return updateReport({ reportId, isHandle: true });
        },
        onSuccess(data) {
            getReportQuery.refetch();
        },
    });
    const reports = getReportQuery?.data;
    console.log('🚀 ~ file: page.jsx:12 ~ ReportPage ~ data:', reports);
    if (!reports) return <></>;
    return (
        <div className="grid grid-cols-4 gap-4">
            {reports.map((report) => (
                <div
                    key={report._id}
                    className="rounded-lg p-4 bg-white flex flex-col  ">
                    <div className="flex gap-2">
                        <span>User</span>:{' '}
                        <p className="text-gray-500 font-medium">
                            {report.userId.name}
                        </p>
                        <Link href={routes.store(report.userId._id)}>
                            <Eye className="bg-primary p-1 rounded-md" />
                        </Link>
                    </div>
                    <div className="flex gap-2">
                        <span>Product</span>:{' '}
                        <p className="text-gray-500 font-medium">
                            {report.productId.name}
                        </p>
                        <Link href={routes.productDetail(report.productId._id)}>
                            <Eye className="bg-primary p-1 rounded-md" />
                        </Link>
                    </div>

                    <div className="flex gap-2">
                        <span>Content</span>: <p>{report.content}</p>
                    </div>
                    <div className="flex gap-2">
                        <span>Handled:</span>{' '}
                        <Switch checked={report?.isHandle} disabled={true} />
                    </div>
                    <div className="flex gap-2">
                        <span>Edit</span>:{' '}
                        <p>
                            <EditProductButton
                                handleEvent={() =>
                                    updateReportMutation.mutate({
                                        reportId: report._id,
                                    })
                                }
                                name={report.productId.name}
                                productId={report.productId._id}
                                lock={report.productId.lock}
                            />
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReportPage;
