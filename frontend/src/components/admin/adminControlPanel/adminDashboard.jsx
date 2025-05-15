import { useEffect, useState } from 'react';
import {
  Container,
  SimpleGrid,
  Grid,
  Skeleton,
  Paper,
  Text,
  Center,
  rem,
  Flex
} from '@mantine/core';
import { PieChart } from '@mantine/charts';
import { useAuth } from '../../../context/AuthContext';

const PRIMARY_COL_HEIGHT = rem(300);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const { user, checkAdmin } = useAuth();

  useEffect(() => {
    if(checkAdmin() === false) {
      alert('You are not an admin');
      window.location.href = '/';
    }
  })

  // Simulated delay for loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2 sec loading
    return () => clearTimeout(timer);
  }, []);

  // Fake data
  const totalUsers = 1000;
  const manufacturers = 400;
  const wholesalers = 600;

  // manufacturers data
  const totalProfileRequest = 500;
  const totalProfileRequestPending = 100;
  const totalProfileRequestApproved = 400;
  const currentRejected = 50;

  // Simulated delay for loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // 2 sec loading
    return () => clearTimeout(timer);
  }, []);

  return (
    <Flex className="h-full neon-border mx-20 flex-col my-10 p-5 rounded bg-[var(--color-secondary)] overflow-hidden">
      <h1 className="text-3xl font-bold mb-5 text-[var(--color-heading)]">Admin Dashboard</h1>
      <Container my="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {/* Left big chart box */}
          <Paper radius="md" p="md" h={PRIMARY_COL_HEIGHT} withBorder>
            {loading ? (
              <Skeleton height="100%" radius="md" />
            ) : (
              <PieChart
                h="100%"
                data={[
                  { name: 'Manufacturers', value: manufacturers, color: 'blue' },
                  { name: 'Wholesalers/Retailers', value: wholesalers, color: 'green' },
                ]}
                tooltipDataSource="segment"
                withTooltip
                labelsPosition="inside"
              />
            )}
          </Paper>

          {/* Right side with 3 boxes */}
          <Grid gutter="md">
            <Grid.Col>
              <Paper radius="md" p="md" withBorder h="100%">
                {loading ? (
                  <Skeleton height="100%" radius="md" />
                ) : (
                  <Center h="100%" style={{ flexDirection: 'column' }}>
                    <Text size="lg" fw={600}>
                      Total Users
                    </Text>
                    <Text size="2rem" fw={700} c="blue">
                      {totalUsers}
                    </Text>
                  </Center>
                )}
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper radius="md" p="md" withBorder h="100%">
                {loading ? (
                  <Skeleton height="100%" radius="md" />
                ) : (
                  <Center h="100%" style={{ flexDirection: 'column' }}>
                    <Text size="md" fw={600}>
                      Manufacturers
                    </Text>
                    <Text size="xl" fw={700} c="blue">
                      {manufacturers}
                    </Text>
                  </Center>
                )}
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper radius="md" p="md" withBorder h="100%">
                {loading ? (
                  <Skeleton height="100%" radius="md" />
                ) : (
                  <Center h="100%" style={{ flexDirection: 'column' }}>
                    <Text size="md" fw={600}>
                      Wholesalers / Retailers
                    </Text>
                    <Text size="xl" fw={700} c="green">
                      {wholesalers}
                    </Text>
                  </Center>
                )}
              </Paper>
            </Grid.Col>
          </Grid>
        </SimpleGrid>
      </Container>
      <h1 className="text-3xl font-bold my-5 text-[var(--color-heading)]">Manufacturer</h1>
      <Container my="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          {/* Left big chart box */}
          <Paper radius="md" p="md" h={PRIMARY_COL_HEIGHT} withBorder>
            {loading ? (
              <Skeleton height="100%" radius="md" />
            ) : (
              <PieChart
                h="100%"
                data={[
                  { name: 'Approved', value: totalProfileRequestApproved, color: 'green' },
                  { name: 'Pending', value: totalProfileRequestPending, color: 'blue' },
                  { name: 'Rejected', value: currentRejected, color: 'red' },
                ]}
                tooltipDataSource="segment"
                withTooltip
                labelsPosition="inside"
              />
            )}
          </Paper>

          {/* Right side with 3 boxes */}
          <Grid gutter="md">
            <Grid.Col>
              <Paper radius="md" p="md" withBorder h="100%">
                {loading ? (
                  <Skeleton height="100%" radius="md" />
                ) : (
                  <Center h="100%" style={{ flexDirection: 'column' }}>
                    <Text size="lg" fw={600}>
                      Total Profile Requests
                    </Text>
                    <Text size="2rem" fw={700} c="blue">
                      {totalProfileRequest}
                    </Text>
                  </Center>
                )}
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper radius="md" p="md" withBorder h="100%">
                {loading ? (
                  <Skeleton height="100%" radius="md" />
                ) : (
                  <Center h="100%" style={{ flexDirection: 'column' }}>
                    <Text size="md" fw={600}>
                      Approved
                    </Text>
                    <Text size="xl" fw={700} c="blue">
                      {totalProfileRequestApproved}
                    </Text>
                  </Center>
                )}
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper radius="md" p="md" withBorder h="100%">
                {loading ? (
                  <Skeleton height="100%" radius="md" />
                ) : (
                  <Center h="100%" style={{ flexDirection: 'column' }}>
                    <Text size="md" fw={600}>
                      Pending
                    </Text>
                    <Text size="xl" fw={700} c="green">
                      {totalProfileRequestPending}
                    </Text>
                  </Center>
                )}
              </Paper>
            </Grid.Col>
            <Grid.Col>
              <Paper radius="md" p="md" withBorder h="100%">
                {loading ? (
                  <Skeleton height="100%" radius="md" />
                ) : (
                  <Center h="100%" style={{ flexDirection: 'column' }}>
                    <Text size="lg" fw={600}>
                      Rejected
                    </Text>
                    <Text size="2rem" fw={700} c="red">
                      {currentRejected}
                    </Text>
                  </Center>
                )}
              </Paper>
            </Grid.Col>
          </Grid>
        </SimpleGrid>
      </Container>
    </Flex>
);
}
