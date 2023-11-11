import { memo } from 'react';

import Pagination from 'react-paginate';
import { ChevronLeft } from 'lucide-react';
import { ChevronRight } from 'lucide-react';

const PaginationCustom = ({ pageCount = 1, handleEvent, page = 1 }) => {
    const handlePageClick = (data) => {
        if (handleEvent) {
            handleEvent(data.selected + 1);
        }
    };
    return (
        <div className="flex justify-center mt-5  py-1">
            <Pagination
                breakLabel="..."
                previousLabel={
                    <div className="flex gap-2 justify-center items-center text-sm">
                        <ChevronLeft className="text-base" />
                        Previous
                    </div>
                }
                nextLabel={
                    <div className="flex gap-2 justify-center items-center text-sm">
                        Next
                        <ChevronRight className="text-base" />
                    </div>
                }
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={parseInt(pageCount) || 1}
                renderOnZeroPageCount={null}
                className="flex gap-2 justify-center items-center"
                pageClassName="flex gap-2"
                forcePage={Math.max(parseInt(page - 1), 0)}
                pageLinkClassName="hover:bg-primary hover:text-black rounded-md w-8 h-8 flex items-center justify-center"
                previousClassName="hover:bg-third rounded-md p-2 "
                nextClassName="hover:bg-third rounded-md p-2 "
                activeLinkClassName="w-8 h-8 flex items-center justify-center rounded-md bg-accent text-white"
            />
        </div>
    );
};

export default memo(PaginationCustom);
