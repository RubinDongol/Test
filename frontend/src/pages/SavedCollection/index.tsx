import { Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';

const SavedCollection = () => {
  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white py-8 px-8 gap-8">
        <Typography className="!text-2xl">Saved Collection</Typography>
      </div>
    </AppWrapper>
  );
};

export default SavedCollection;
