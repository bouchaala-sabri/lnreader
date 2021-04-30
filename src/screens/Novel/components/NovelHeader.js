import React, { useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, Share } from "react-native";
import { TouchableRipple, IconButton, Button, Menu } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";
import { useSelector, useDispatch } from "react-redux";

import {
    downloadAllChaptersAction,
    deleteAllChaptersAction,
} from "../../../redux/novel/novel.actions";
import { GenreChip } from "./Info/GenreChip";
import NovelCoverImage from "./Info/NovelCoverImage";
import FollowChip from "./Info/FollowChip";
import TrackerChip from "./Info/TrackerChip";
import NovelSummary from "./Info/NovelSummary";
import ReadButton from "./Info/ReadButton";

const NovelInfoHeader = ({
    novelName,
    novelCover,
    loading,
    novel,
    chapters,
    theme,
    chaptersSettingsSheetRef,
    trackerSheetRef,
}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [downloadMenu, showDownloadMenu] = useState(false);

    const trackedNovels = useSelector(
        (state) => state.trackerReducer.trackedNovels
    );

    let isTracked = false;

    if (!loading) {
        isTracked = trackedNovels.find((obj) => obj.novelId === novel.novelId);
    }

    const getGenres = ({ item }) => <GenreChip theme={theme}>{item}</GenreChip>;

    return (
        <View style={{ flexGrow: 1 }}>
            <NovelCoverImage source={{ uri: novelCover }} theme={theme}>
                <View style={styles.detailsContainer}>
                    <View>
                        <Image
                            source={{ uri: novelCover }}
                            style={styles.logo}
                        />
                    </View>
                    <View style={styles.nameContainer}>
                        <Text
                            numberOfLines={2}
                            style={[
                                styles.name,
                                { color: theme.textColorPrimary },
                            ]}
                        >
                            {novelName}
                        </Text>
                        {!loading && (
                            <>
                                <Text
                                    style={{
                                        color: theme.textColorSecondary,
                                        marginVertical: 3,
                                        fontSize: 14,
                                        fontWeight: "bold",
                                    }}
                                    numberOfLines={2}
                                >
                                    {novel.author.replace(",", ", ")}
                                </Text>

                                <Text
                                    style={{
                                        color: theme.textColorSecondary,
                                        marginVertical: 3,
                                        fontSize: 14,
                                    }}
                                    numberOfLines={1}
                                >
                                    {novel.status}
                                </Text>
                                <Text
                                    style={{
                                        color: theme.textColorSecondary,
                                        fontSize: 14,
                                    }}
                                    numberOfLines={1}
                                >
                                    {novel.source}
                                </Text>
                            </>
                        )}
                    </View>
                </View>
            </NovelCoverImage>
            {!loading && (
                <>
                    <View style={styles.buttonsContainer}>
                        <FollowChip
                            theme={theme}
                            followed={novel.followed}
                            novel={novel}
                        />
                        <TrackerChip
                            theme={theme}
                            isTracked={isTracked}
                            trackerSheetRef={trackerSheetRef}
                        />
                        <IconButton
                            onPress={() =>
                                WebBrowser.openBrowserAsync(novel.sourceUrl)
                            }
                            icon="earth"
                            color={theme.colorAccentDark}
                            size={21}
                        />
                        <IconButton
                            onPress={() =>
                                Share.share({ message: novel.sourceUrl })
                            }
                            icon="share-variant"
                            color={theme.colorAccentDark}
                            size={21}
                        />
                        <Menu
                            visible={downloadMenu}
                            onDismiss={() => showDownloadMenu(false)}
                            anchor={
                                <IconButton
                                    icon="download"
                                    color={theme.colorAccentDark}
                                    size={21}
                                    onPress={() => showDownloadMenu(true)}
                                />
                            }
                            contentStyle={{ backgroundColor: theme.menuColor }}
                        >
                            <Menu.Item
                                title="Download all"
                                style={{ backgroundColor: theme.menuColor }}
                                titleStyle={{ color: theme.textColorPrimary }}
                                onPress={() =>
                                    dispatch(
                                        downloadAllChaptersAction(
                                            novel.sourceId,
                                            novel.novelUrl,
                                            chapters
                                        )
                                    )
                                }
                            />
                            <Menu.Item
                                title="Delete downloads"
                                style={{ backgroundColor: theme.menuColor }}
                                titleStyle={{ color: theme.textColorPrimary }}
                                onPress={() =>
                                    dispatch(deleteAllChaptersAction(chapters))
                                }
                            />
                        </Menu>
                    </View>
                    <NovelSummary
                        summary={novel.novelSummary}
                        followed={novel.followed}
                        theme={theme}
                    />
                    <FlatList
                        style={
                            novel.novelSummary === ""
                                ? { marginTop: 20 }
                                : { marginTop: 12 }
                        }
                        contentContainerStyle={styles.genreContainer}
                        horizontal
                        data={novel.genre.split(",")}
                        keyExtractor={(item) => item}
                        renderItem={getGenres}
                        showsHorizontalScrollIndicator={false}
                    />
                    <ReadButton
                        novel={novel}
                        chapters={chapters}
                        navigation={navigation}
                        theme={theme}
                    />
                    <TouchableRipple
                        style={styles.bottomsheet}
                        onPress={() =>
                            chaptersSettingsSheetRef.current.show({
                                velocity: -1.5,
                            })
                        }
                        rippleColor={theme.rippleColor}
                    >
                        <>
                            <Text
                                style={[
                                    { color: theme.textColorPrimary },
                                    styles.chapters,
                                ]}
                            >
                                {`${chapters.length} Chapters`}
                            </Text>
                            <IconButton
                                icon="filter-variant"
                                color={theme.textColorPrimary}
                                size={24}
                            />
                        </>
                    </TouchableRipple>
                </>
            )}
        </View>
    );
};

export default NovelInfoHeader;

const styles = StyleSheet.create({
    nameContainer: {
        flex: 1,
        marginHorizontal: 16,
        paddingTop: 8,
    },
    detailsContainer: {
        flex: 1,
        flexDirection: "row",
        margin: 16,
        paddingTop: 90,
    },
    logo: {
        height: 160,
        width: 110,
        margin: 3.2,
        borderRadius: 6,
    },
    name: {
        fontWeight: "bold",
        fontSize: 18,
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    chapters: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        fontSize: 16,
        fontWeight: "bold",
    },
    bottomsheet: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingRight: 12,
    },

    genreContainer: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
});