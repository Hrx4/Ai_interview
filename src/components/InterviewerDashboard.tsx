import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { FilterDropdownProps } from 'antd/es/table/interface';
import type { Candidate } from '../types';
import { useAppSelector as useSelector } from '../hooks/useAppSelector';
import ViewDetails from './ViewDetails';


type DataIndex = keyof Candidate;


const InteviewerDashboard: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [candidate, setCandidate] = useState<Candidate >(null!);
 
  
  const candidates = useSelector((state)=> state.candidates.candidates)

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<Candidate> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        null
      ) : (
        text
      ),
  });

   const showModal = (candidate:Candidate) => {
    setCandidate(candidate);
    setDetailsModalVisible(true);
  };


  const handleCancel = () => {
    setDetailsModalVisible(false);
  };

  const columns: TableColumnsType<Candidate> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name >b.name ? 1 : -1,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Score',
      dataIndex: "score",
      key: 'score',
      // width: '20%',
      // sorter: (a, b) => a.score - b.score,
      render: (text, record) => <span>{record.score !== undefined ? record.score : 'N/A'}</span>,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Applied Date',
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => <span>{text}</span>, 
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Details',
      render:(_ , record)=><Button type='primary' onClick={()=>
      {
        showModal(record)
        }
    }>View</Button>,
    }
  ];

  return<>
  {
    candidates && <Table columns={columns} dataSource={candidates} />
    
  }
  {
    detailsModalVisible && <ViewDetails detilsModalVisible={detailsModalVisible} handleCancel={handleCancel} candidate={candidate}/>
  }
  </>;
};

export default InteviewerDashboard;