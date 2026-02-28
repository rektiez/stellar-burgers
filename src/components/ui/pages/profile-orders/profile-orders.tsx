import { FC } from 'react';
import styles from './profile-orders.module.css';
import { ProfileOrdersUIProps } from './type';
import { ProfileMenu, OrdersList } from '@components';

export const ProfileOrdersUI: FC<ProfileOrdersUIProps> = ({ orders }) => (
  <main className={styles.main}>
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <ProfileMenu />
      </div>
      <div className={styles.orders}>
        {!orders || orders.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}> У вас пока нет заказов</p>
          </div>
        ) : (
          <OrdersList orders={orders} />
        )}
      </div>
    </div>
  </main>
);
