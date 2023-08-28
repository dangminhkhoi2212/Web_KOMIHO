'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';
import { Breadcrumb } from 'flowbite-react';

const BreadCump = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    const generateBreadcrumbs = useMemo(() => {
        // Remove any query parameters, as those aren't included in breadcrumbs
        const asPathWithoutQuery = pathname.split('?')[0];

        // Break down the path between "/"s, removing empty entities
        // Ex:"/my/nested/path" --> ["my", "nested", "path"]
        const asPathNestedRoutes = asPathWithoutQuery
            .split('/')
            .filter((v) => v !== '');

        // Iterate over the list of nested route parts and build
        // a "crumb" object for each one.
        const crumblist = asPathNestedRoutes.map((subpath, idx) => {
            // We can get the partial nested route for the crumb
            // by joining together the path parts up to this point.
            const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/');
            // The title will just be the route string for now
            const title = subpath.charAt(0).toUpperCase() + subpath.slice(1);
            return { href, title };
        });

        // Add in a default "Home" crumb for the top-level
        return [{ href: '/', title: 'Home' }, ...crumblist];
    }, [pathname]);
    useEffect(() => {
        setBreadcrumbs(generateBreadcrumbs);
    }, [pathname]);

    return (
        <>
            {pathname !== '/' && (
                <Breadcrumb>
                    {breadcrumbs &&
                        breadcrumbs.map((breadcrumb, index) => (
                            <Breadcrumb.Item key={breadcrumb.title}>
                                <Link href={breadcrumb.href} className="inline">
                                    {breadcrumb.title}
                                </Link>
                            </Breadcrumb.Item>
                        ))}
                </Breadcrumb>
            )}
        </>
    );
};

export default BreadCump;
