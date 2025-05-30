import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button, // Not directly used in the trigger, but kept if needed elsewhere
  Tabs,
  Badge,
  Text,
  ScrollArea,
  Accordion,
  Loader,
  Group,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

const NotificationModal = ({ userId, opened, onClose }) => {
  const ServerUrl = import.meta.env.VITE_SERVER_URL;
//   const [opened, { open, close }] = useDisclosure(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'unread'

  // Fetch notifications when the modal opens or userId changes
   useEffect(() => {
    if (opened && userId) {
      fetchNotifications();
    } else if (!opened) {
      // Clear notifications when modal closes to ensure fresh data on next open
      setNotifications([]);
    }
  }, [opened, userId]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`${ServerUrl}/api/notifications/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Handle error (e.g., show a toast notification)
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await axios.put(`${ServerUrl}/api/notifications/read/${notificationId}`);
      // Optimistically update the UI
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Handle error
    }
  };

  const filteredNotifications = notifications.filter((notif) =>
    activeTab === 'all' ? true : !notif.read
  );

  const groupNotificationsByType = (notificationsToGroup) => {
    const grouped = {
      approval: [],
      rejection: [],
      general: [],
    };
    notificationsToGroup.forEach((notif) => {
      if (grouped[notif.type]) {
        grouped[notif.type].push(notif);
      }
    });
    return grouped;
  };

  const groupedAndFilteredNotifications = groupNotificationsByType(filteredNotifications);

  const renderNotifications = (notificationsArray) => {
    if (notificationsArray.length === 0) {
      return <Text size="sm" color="dimmed">No notifications of this type.</Text>;
    }
    return (
      <Accordion chevronPosition="right" variant="contained" mt={8}>
        {notificationsArray.map((notification) => (
          <Accordion.Item
            key={notification._id}
            value={notification._id}
            onClick={() => !notification.read && markNotificationAsRead(notification._id)}
            // Apply Tailwind classes directly
            className={`
              bg-[var(--color-secondary)]
              rounded-md p-3 mb-2 shadow-sm
              transition-colors duration-200 ease-in-out
              hover:bg-gray-100 dark:hover:bg-gray-700
              ${!notification.read ? 'border-l-4 border-blue-500 dark:border-blue-600 bg-blue-50 dark:bg-blue-900' : ''}
              ${!notification.read ? 'hover:bg-blue-100 dark:hover:bg-blue-800' : ''}
            `}
          >
            <Accordion.Control>
              <Group position="apart" noWrap>
                <Text className="font-semibold">{notification.title}</Text>
                <Badge size="sm" color={notification.read ? 'gray' : 'blue'}>
                  {notification.read ? 'Read' : 'New'}
                </Badge>
              </Group>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(notification.createdAt).toLocaleString()}
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Text size="sm">{notification.message}</Text>
              <Text size="xs" color="dimmed" mt="xs">
                Type: {notification.type}
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Your Notifications"
      size="lg"
      radius={'md'}
      className={'bg-[var(--color-primary)]neon-border'}
      style={{
          color: 'var(--color-heading)'
        }}
      centered
      bg={'var(--color-primary)'}
    >
      <Tabs value={activeTab} onTabChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="all">All ({notifications.length})</Tabs.Tab>
          <Tabs.Tab value="unread">
            Unread (
            {notifications.filter((notif) => !notif.read).length})
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {loading ? (
        <Group position="center" my="xl">
          <Loader />
          <Text>Loading notifications...</Text>
        </Group>
      ) : (
        <ScrollArea h={400} type="always">
          <Text className="mb-3 mt-4 font-bold text-lg">Approvals</Text>
          {renderNotifications(groupedAndFilteredNotifications.approval)}

          <Text className="mb-3 mt-4 font-bold text-lg">Rejections</Text>
          {renderNotifications(groupedAndFilteredNotifications.rejection)}

          <Text className="mb-3 mt-4 font-bold text-lg">General</Text>
          {renderNotifications(groupedAndFilteredNotifications.general)}

          {filteredNotifications.length === 0 && (
            <Text align="center" mt="md" color="dimmed">
              No notifications to display in this category.
            </Text>
          )}
        </ScrollArea>
      )}
    </Modal>
  );
};

export default NotificationModal;