import styles from "./SwiperCarousel.module.scss";
import MovieCardWithHover from "~/components/movie/MovieCardWithHover/MovieCardWithHover";

import PropTypes from "prop-types";
import { Button, Flex, Skeleton } from "antd";
import classNames from "classnames/bind";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SwiperSlide, Swiper } from "swiper/react";

import { Autoplay, Scrollbar, Navigation } from "swiper/modules";
import cardNavId from "~/utils/cardNavId";

import "swiper/css";
import "swiper/css/navigation";
import { useMemo } from "react";

const cx = classNames.bind(styles);
function SwiperCarousel({ data, isLoading }) {
  const cardNav = useMemo(() => cardNavId(), []);

  return (
    <>
      {!isLoading ? (
        <Flex
          align='center'
          justify='space-between'
          className={cx("nav-container")}
        >
          <Button
            size='large'
            shape='circle'
            className={cx(`custom-prev-${cardNav}`, "nav-btn-prev")}
            icon={<FaChevronLeft />}
          />
          <Swiper
            modules={[Navigation, Scrollbar, Autoplay]}
            slidesPerView={4}
            spaceBetween={18}
            navigation={{
              prevEl: `.custom-prev-${cardNav}`,
              nextEl: `.custom-next-${cardNav}`,
            }}
            breakpoints={{
              320: { slidesPerView: 3, spaceBetween: 18 }, // Mobile nhỏ
              480: { slidesPerView: 5, spaceBetween: 18 }, // Mobile lớn
              768: { slidesPerView: 6, spaceBetween: 18 }, // Tablet
              1024: { slidesPerView: 7, spaceBetween: 18 }, // Desktop
              1440: { slidesPerView: 5, spaceBetween: 18 }, // Màn lớn
              1710: { slidesPerView: 6, spaceBetween: 18 }, // Màn lớn
            }}
            className={cx("carousel")}
          >
            {Array.isArray(data?.items) &&
              data.items?.map((item, index) => (
                <SwiperSlide key={item._id} virtualIndex={index}>
                  <MovieCardWithHover
                    imageUrl={data?.APP_DOMAIN_CDN_IMAGE}
                    movieData={item}
                    direction={"horizontal"}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
          <Button
            size='large'
            shape='circle'
            className={cx(`custom-next-${cardNav}`, "nav-btn-next")}
            icon={<FaChevronRight />}
          />
        </Flex>
      ) : (
        <Flex
          align='center'
          justify='space-between'
          className={cx("nav-container", "skeleton-container")}
        >
          <Button
            size='large'
            shape='circle'
            className={cx("nav-btn-prev")}
            icon={<FaChevronLeft />}
            disabled
          />
          <Flex gap={18} className={cx("skeleton-carousel")}>
            {[...Array(7)].map((_, index) => (
              <div key={index} className={cx("skeleton-card")}>
                <Skeleton.Image active style={{ width: 160, height: 240 }} />
                <Skeleton.Button
                  active
                  size='small'
                  shape='square'
                  block
                  style={{ marginTop: 8, height: 16 }}
                />
                <Skeleton.Button
                  active
                  size='small'
                  shape='square'
                  block
                  style={{ marginTop: 4, height: 14, width: "70%" }}
                />
              </div>
            ))}
          </Flex>
          <Button
            size='large'
            shape='circle'
            className={cx("nav-btn-next")}
            icon={<FaChevronRight />}
            disabled
          />
        </Flex>
      )}
    </>
  );
}

SwiperCarousel.propTypes = {
  data: PropTypes.shape({
    APP_DOMAIN_CDN_IMAGE: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  isLoading: PropTypes.bool.isRequired,
};
export default SwiperCarousel;
