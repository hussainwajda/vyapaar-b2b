import React, { useEffect, useState, useRef } from 'react';
import {
    Tabs,
    Select,
    Card,
    Skeleton,
    Text,
    Group,
    Button,
    Image,
    Badge,
    Grid,
    Modal,
    Flex,
    Container,
    Anchor,
    Transition,
    Textarea,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Check, Link, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {ToastContainer, toast} from 'react-toastify';
import axios from 'axios';

// ===============================
// Reusable Components
// ===============================

const SpotlightCard = ({
    children,
    className = "",
    spotlightColor = "rgba(255, 255, 255, 0.25)",
    onClick, // Added onClick prop
}) => {
    const divRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current || isFocused) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setIsFocused(true);
        setOpacity(0.6);
    };

    const handleBlur = () => {
        setIsFocused(false);
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(0.6);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative rounded-3xl border border-neutral-800 bg-neutral-900 overflow-hidden p-6 ${className} cursor-pointer`} // Added cursor-pointer
            onClick={onClick} // Added onClick handler
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
                style={{
                    opacity,
                    background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
                }}
            />
            {children}
        </div>
    );
};

const ProfileCard = ({ profile, onApprove, onReject, loading, onImageClick, activeTab }) => { // Added onImageClick
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [confirmation, setConfirmation] = useState({ open: false, type: null });
    const [rejectReason, setRejectReason] = useState('');

    if (loading) {
        return (
            <Card shadow="sm" p="lg" radius="md" withBorder>
                <Skeleton height={30} mb="sm" animate />
                <Skeleton height={20} mb="sm" animate />
                <Skeleton height={20} mb="sm" animate />
                <Skeleton height={20} mb="sm" animate />
                <Skeleton height={20} animate />
            </Card>
        );
    }

    const renderImage = (src, alt, width = '100%', height = 'auto') => (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            radius="md"
            withPlaceholder
            onClick={() => onImageClick(src)} // Call onImageClick
            className="cursor-pointer" // Add cursor style
            style={{ objectFit: 'contain' }} // Ensure image doesn't distort
        />
    );

    return (
        <SpotlightCard className="w-full neon-border" spotlightColor="rgba(100, 100, 255, 0.3)" >
            <Grid gutter="xl">
                {/* Basic Info */}
                <Grid.Col span={12} sm={6} md={4}>
                    <Text fz="lg" fw={600}>{profile.name}</Text>
                    <Badge color="blue">{profile.role}</Badge>
                    <Text>{profile.email}</Text>
                    <Text>{profile.phone}</Text>
                    <Text>{profile.company_type}</Text>
                </Grid.Col>

                {/* Legal Info */}
                <Grid.Col span={12} sm={6} md={4}>
                    <Text fw={500}>GST No:</Text> {profile.GST_no}
                    <Text fw={500}>PAN No:</Text> {profile.PAN_no}
                </Grid.Col>

                {/* Address */}
                <Grid.Col span={12} sm={6} md={4}>
                    <Text fw={500}>Address:</Text>
                    <Text>{profile?.address?.line1}</Text>
                    <Text>{profile?.address?.line2}</Text>
                    <Text>{profile?.address?.city}, {profile.address?.state} {profile.address?.pincode}</Text>
                </Grid.Col>

                {/* Contact Person */}
                <Grid.Col span={12} sm={6} md={4}>
                    <Text fw={500}>Contact Person:</Text>
                    <Text>{profile.contact_person?.name} - {profile.contact_person?.designation}</Text>
                    <Text>{profile.contact_person?.email}, {profile.contact_person?.phone}</Text>
                </Grid.Col>

                {/* Certifications and Categories */}
                <Grid.Col span={12} sm={6} md={4}>
                    <Text fw={500}>Certifications:</Text> {profile.certifications?.join(', ')}
                    <Text fw={500}>Categories:</Text> {profile.categories?.join(', ')}
                </Grid.Col>

                {/* Website and Establishment */}
                <Grid.Col span={12} sm={6} md={4}>
                    <Anchor href={profile.website} rel="_blank" fw={500}>Website: {profile.website}</Anchor> 
                    <Text fw={500}>Year of Establishment:</Text> {profile.year_of_establishment}
                </Grid.Col>

                {/* Images */}
                <Grid.Col span={12} md={4}>
                    <Text fw={500} mb={5}>GST Certificate</Text>
                    {renderImage(profile.documents?.gst_certificate, 'GST Certificate', '100%', 150)}
                </Grid.Col>
                <Grid.Col span={12} md={4}>
                    <Text fw={500} mb={5}>PAN Card</Text>
                    {renderImage(profile.documents?.pan_card, 'PAN Card', '100%', 150)}
                </Grid.Col>
                <Grid.Col span={12} md={4}>
                    <Text fw={500} mb={5}>Incorporation Certificate</Text>
                    {renderImage(profile.documents?.incorporation_certificate, 'Incorporation Certificate', '100%', 150)}
                </Grid.Col>

                {/* Optional other documents */}
                {profile.documents?.others && profile.documents?.others.length > 0 && (
                    <Grid.Col span={12}>
                        <Text fw={500}>Other Documents:</Text>
                        <Group wrap="wrap" mt="xs">
                            {profile.documents.others.map((doc, i) => (
                                 renderImage(doc, `Other Document ${i + 1}`, 100, 100)
                            ))}
                        </Group>
                    </Grid.Col>
                )}
                {activeTab === 'pending' && (
                    <Grid.Col span={12} mt="lg">
                    <Group position="right" spacing="md">
                        <Button
                            color="green"
                            onClick={() => setConfirmation({ open: true, type: 'approve' })}
                            disabled={confirmation.open} // Disable while confirmation is open
                        >
                            <span><Check /></span><span className="ml-2"></span>Approve
                        </Button>
                        <Button
                            color="red"
                            onClick={() => setConfirmation({ open: true, type: 'reject' })}
                            disabled={confirmation.open} // Disable while confirmation is open
                        >
                            <span><X /></span><span className="ml-2"></span>Reject
                        </Button>
                    </Group>
                </Grid.Col>
                )}
                

            {/* Confirmation Dialog */}
            <Grid.Col span={12}>
                <Transition mounted={confirmation.open} transition="fade" duration={200}>
                    {(styles) => (
                    <div style={styles}>
                        <Card shadow="md" className="mt-4">
                        <Group position="apart" align="start" grow>
                            <div style={{ flex: 1 }}>
                            <Text mb="sm">
                                Are you sure you want to {confirmation.type === 'approve' ? 'approve' : 'reject'} this profile?
                            </Text>

                            {confirmation.type === 'reject' && (
                                <Textarea
                                placeholder="Enter reason for rejection"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.currentTarget.value)}
                                required
                                />
                            )}
                            </div>

                            <Group spacing="md" mt="sm">
                            <Button
                                variant="outline"
                                onClick={() => {
                                setConfirmation({ open: false, type: null });
                                setRejectReason('');
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                color={confirmation.type === 'approve' ? 'green' : 'red'}
                                onClick={() => {
                                if (confirmation.type === 'approve') {
                                    onApprove(profile._id);
                                } else if (confirmation.type === 'reject') {
                                    onReject(profile._id, rejectReason);
                                }
                                setConfirmation({ open: false, type: null });
                                setRejectReason('');
                                }}
                                disabled={loading || (confirmation.type === 'reject' && rejectReason.trim() === '')}
                            >
                                Confirm
                            </Button>
                            </Group>
                        </Group>
                        </Card>
                    </div>
                    )}
                </Transition>
                </Grid.Col>


            </Grid>
        </SpotlightCard>
    );
};

function adminManufacturer() {
    // const ServerUrl = import.meta.env.VITE_SERVER_URL;  
    const ServerUrl = "http://localhost:3001";
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('pending');
    const [sortBy, setSortBy] = useState('created_at');
    const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [loadingId, setLoadingId] = useState(null);


    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${ServerUrl}/api/admin/profiles`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data.data);
            setProfiles(data.data);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (profileId) => {
        try {
            setLoadingId(profileId);
            const res = await axios.post(`${ServerUrl}/api/admin/approveProfile`, { profileId });
            toast.success(res.data.message || "Profile approved");
            fetchProfiles();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to approve profile");
        } finally {
            setLoadingId(null);
        }
    };

    const handleReject = async (profileId, reason) => {
        try {
            setLoadingId(profileId);
            const res = await axios.post(`${ServerUrl}/api/admin/rejectProfile`, { profileId: profileId, reason: reason });
            toast.success(res.data.message || "Profile rejected");
            fetchProfiles();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reject profile");
        } finally {
            setLoadingId(null);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    const filteredProfiles = profiles.filter((p) => {
        if (activeTab === 'pending') return p.is_verified === false && p.status !== 'rejected';
        if (activeTab === 'approved') return p.is_verified === true;
        if (activeTab === 'rejected') return p.status === 'rejected';
        return false;
    });

    const sortedProfiles = [...filteredProfiles].sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        }
        // Default sort by created_at (newest first)
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
    });

    return (
    <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={theme}
          />
        <div className="bg-[var(--color-secondary)] min-h-screen">
            <Container className="!mx-15 my-10 p-10 rounded overflow-hidden">
                <Flex justify="space-between" align="center" mb="md">
                    <Text fw={700} size="xl">Profile Requests</Text>
                    <Select
                        value={sortBy}
                        onChange={setSortBy}
                        data={[
                            { value: 'created_at', label: 'Newest First' },
                            { value: 'name', label: 'Name' },
                        ]}
                    />
                </Flex>

                <Tabs value={activeTab} onChange={setActiveTab} mb="lg">
                    <Tabs.List>
                        <Tabs.Tab value="pending">Pending</Tabs.Tab>
                        <Tabs.Tab value="approved">Approved</Tabs.Tab>
                        <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
                    </Tabs.List>
                </Tabs>

                <Grid gutter="xl">
                    <AnimatePresence>
                        {(loading ? Array(4).fill({}) : sortedProfiles).map((profile, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Grid.Col span={{ base: 12, sm: 6, md: 5 }}>
                                    <ProfileCard
                                        profile={profile}
                                        activeTab={activeTab}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                        loading={loadingId === profile._id}
                                        onImageClick={setFullScreenImage} // Pass click handler
                                    />
                                </Grid.Col>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </Grid>
                {/* Full Screen Image Modal */}
                <Modal
                    opened={!!fullScreenImage} // Open if fullScreenImage has a value
                    onClose={() => setFullScreenImage(null)} // Close and reset
                    fullScreen
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Image
                            src={fullScreenImage || ""}
                            alt="Full Screen"
                            width="auto"
                            height="auto"
                            style={{ maxHeight: '90vh', maxWidth: '90vw' }} // Limit size
                        />
                    </div>
                </Modal>

            </Container>
        </div>
    </div>
    );
}

export default adminManufacturer;
