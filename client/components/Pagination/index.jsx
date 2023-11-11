import { getPageFilter } from '@/redux/selector';
import dynamic from 'next/dynamic';
import { memo } from 'react';
import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import Pagination from 'react-paginate';

const PaginationCustom = ({ pageCount, handleEvent, page }) => {
    const handlePageClick = (data) => {
        if (handleEvent) {
            handleEvent(data.selected + 1);
        }
    };
    return (
        <div className="flex justify-center mt-5 border-t-2 py-1">
            <Pagination
                breakLabel="..."
                previousLabel={
                    <div className="flex gap-2 justify-center items-center text-sm">
                        <BiLeftArrowAlt className="text-base" />
                        Previous
                    </div>
                }
                nextLabel={
                    <div className="flex gap-2 justify-center items-center text-sm">
                        Next
                        <BiRightArrowAlt className="text-base" />
                    </div>
                }
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={parseInt(pageCount) || 0}
                renderOnZeroPageCount={null}
                className="flex gap-2 justify-center items-center"
                pageClassName="flex gap-2"
                forcePage={parseInt(page - 1)}
                pageLinkClassName="hover:bg-primary hover:text-black rounded-md w-8 h-8 flex items-center justify-center"
                previousClassName="hover:bg-third rounded-md p-2 "
                nextClassName="hover:bg-third rounded-md p-2 "
                activeLinkClassName="w-8 h-8 flex items-center justify-center rounded-md bg-accent text-white"
            />
        </div>
    );
};

export default memo(PaginationCustom);
