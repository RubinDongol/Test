import { useState } from 'react';
import { Rate, Typography } from 'antd';
import { AppWrapper } from '../../components/layouts';
import { BookmarkIcon, UserIcon } from '../../assets';
import TextArea from 'antd/es/input/TextArea';
import { ReviewCard } from '../../components/recipes';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { USER_REVIEWS } from '../../utils/data';

const RecipeDetail = () => {
  const [isNoteInputVisible, setNoteInputVisible] = useState(false);
  const location = useLocation();
  const { data } = location.state || {};
  const { imageUrl, recipeName } = data || {};
  return (
    <AppWrapper>
      <div className="h-full flex flex-col border border-black bg-white flex-1 overflow-y-scroll">
        <div className="flex flex-col py-8 px-8 gap-4 border-b border-black">
          <Typography className="!text-2xl">
            {recipeName || 'Burger'}
          </Typography>
          <div className="flex gap-8">
            <div className="space-y-2">
              <div className="w-[402px] h-[188px] rounded-[14px] bg-black shrink-0">
                <img
                  src={
                    imageUrl ||
                    'https://images.pexels.com/photos/15076692/pexels-photo-15076692/free-photo-of-burger.jpeg'
                  }
                  className="w-full h-full object-contain rounded-full hover:shadow-md"
                  alt="food-item"
                />
              </div>
              <div className="flex gap-2 justify-between items-center">
                <div
                  className="flex gap-1 items-center"
                  onClick={e => e.stopPropagation()}>
                  <Rate allowHalf defaultValue={3.5} />
                  <Typography className="!text-base">28 Reviews</Typography>
                </div>
                <button className="flex justify-between items-center gap-2 cursor-pointer">
                  <img
                    src={BookmarkIcon}
                    alt="bookmark"
                    className="w-5 h-5 object-contain"
                  />
                  <Typography className="!text-base !text-[#807F7F]">
                    Save Review
                  </Typography>
                </button>
              </div>
            </div>
            <Typography className="!text-base">
              There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by
              injected humour, or randomised words which don't look even
              slightly believable. If you are going to use a passage of Lorem
              Ipsum, you need to be sure there isn't anything embarrassing
              hidden in the middle of text. All the Lorem Ipsum generators on
              the Internet tend to repeat predefined chunks as necessary, making
              this the first true generator on the Internet
            </Typography>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-4 w-1/5">
              <Typography className="!text-2xl">Ingredients</Typography>
              {['Tomato', 'Potato', '1 tbsp salt'].map((item, index) => (
                <Typography key={item} className="!text-base">
                  {index + 1}. {item}
                </Typography>
              ))}
            </div>
            <div className="flex flex-col gap-4 w-2/5">
              <Typography className="!text-2xl">Directions</Typography>
              <Typography className="!text-base">
                There are many variations of passages of Lorem Ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable.
              </Typography>
            </div>
            <div className="flex flex-col gap-4 w-2/5">
              <Typography
                className="!text-2xl cursor-pointer"
                onClick={() => setNoteInputVisible(true)}>
                Add a note&nbsp;
                <PlusCircleOutlined className="text-lg" />
              </Typography>

              <TextArea
                placeholder={isNoteInputVisible ? 'Add Note' : ''}
                autoSize={{ minRows: 3, maxRows: 3 }}
                readOnly={!isNoteInputVisible}
                className={`${isNoteInputVisible ? '' : '!border-none !shadow-none !px-0 !py-0'} !text-base`}
              />
              {isNoteInputVisible && (
                <button
                  className="bg-[#B5B5B5] px-4 rounded-full flex self-end cursor-pointer"
                  onClick={() => setNoteInputVisible(false)}>
                  <Typography className="text-black !text-base">
                    Save
                  </Typography>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="px-8 pt-8 pb-4 flex flex-col border-b border-b-[#A6A3A3]">
          <div className="flex gap-2">
            <img src={UserIcon} alt="user" className="w-5 h-5 object-contain" />
            <TextArea
              placeholder="Leave a review..."
              autoSize={{ minRows: 3, maxRows: 3 }}
              className="!text-black"
            />
          </div>
        </div>
        <div className="">
          {USER_REVIEWS.map(item => {
            return <ReviewCard key={item.id} data={item} />;
          })}
        </div>
      </div>
    </AppWrapper>
  );
};

export default RecipeDetail;
