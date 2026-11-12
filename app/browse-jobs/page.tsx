import React from 'react';

const BrowseJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search = await searchParams;
    const urlsearch = new URLSearchParams(search as Record<string, string>);
    const query = urlsearch.toString();
    console.log('Search params:', query);  

    return (
        <div>
            <h1>Browse Jobs</h1>
        </div>
    );
};

export default BrowseJobsPage;