import { InfiniteLoader, List, AutoSizer } from 'react-virtualized';
import { ProductRow } from '../components/product-row';
type HeightWidth={height:number,width:number}
type Dict={[row:string]:any}
export const InfiniteScroll=({products,loadMoreRows,hasNext})=>{
    return (<AutoSizer>
          {({ height, width }:HeightWidth) => (
            <InfiniteLoader
              isRowLoaded={({ index }:Dict) => !!products[index]}
              loadMoreRows={loadMoreRows}
              rowCount={hasNext ? products.length + 1 : products.length}
            >
              {({ onRowsRendered }:Dict) => (
                <List
                  width={width}
                  height={height}
                  rowCount={products.length}
                  rowHeight={50} // Adjust row height as needed
                  rowRenderer={({ index, key, style }:Dict) => (
                    <ProductRow
                      key={key}
                      product={products[index]}
                      style={style}
                    />
                  )}
                  onRowsRendered={onRowsRendered}
                  overscanRowCount={5} // Pre-render rows for smoother experience
                  style={{backgroundcolor:"transparent"}}
                />
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
    )
}


  
  