import React, { useState, useEffect, Component } from "react";
import {
	View,
	SafeAreaView,
	ActivityIndicator,
	FlatList,
	Text,
	Image,
	StyleSheet,
	Alert,
	Modal,
	TouchableOpacity,
	ImageBackground,
	Pressable,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { SliderBox } from "react-native-image-slider-box";

import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Location from "expo-location";
import { NFTCard1, HomeHeader, FocusedStatusBar } from "../components";
import { COLORS, config, SIZES, assets } from "../constants";
import SubServicesModal from "../components/SubServicesModal";
import { ScrollView } from "react-native-gesture-handler";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { TabActions } from "@react-navigation/core";
import DeliverablesHeader from "../components/DelieverablesHeader";
import ModalList from "../components/ModalList";
import Deliverables from "./Bookings";
import Bookings from "./Bookings";
import Search from "./Search";

let apiKey = "YOUR_API_KEY";

function ServicesScreen() {
	const [isLoading, setLoading] = useState(true);
	const [data2, setData] = useState([]);
	const [data2_backup, setDataBackup] = useState([]);
	const [subSModalVisible, setSubSModalVisible] = useState(-1);
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [address, setAddress] = useState(null);

	const [modalVisible, setModalVisible] = useState(false);
	const navigation = useNavigation();
	//vahan se utha le

	const getLocation = () => {
		(async () => {
			let { status } =
				await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setErrorMsg("Permission to access location was denied");
			}

			Location.setGoogleApiKey(apiKey);

			console.log(status);

			let { coords } = await Location.getCurrentPositionAsync();

			setLocation(coords);

			//console.log(coords);

			if (coords) {
				let { longitude, latitude } = coords;

				let regionName = await Location.reverseGeocodeAsync({
					longitude,
					latitude,
				});
				setAddress(regionName[0]);
				//console.log(regionName, "nothing");
			}

			// console.log();
		})();
	};

	if (!location) getLocation();

	const handleSearch = (value) => {
		if (value.length === 0) {
			setData(data2_backup);
		}

		const filteredData = data2_backup.filter((item) =>
			item.S_Name.toLowerCase().includes(value.toLowerCase())
		);

		/* if (filteredData.length === 0) {
			setData(data2_backup);
		} else {
			setData(filteredData);
		} */
		setData(filteredData);
	};

	useEffect(() => {
		const C_Lat = 30.697;
		const C_Lon = 76.7389;

		//const C_Lat = Location.latitude;
		//const C_Lon = Location.longitude;
		fetch(
			config.domain +
				"/getLocationBasedServices/" +
				C_Lat +
				"/" +
				C_Lon,
			{
				method: "GET",
			}
		)
			.then((response) => response.json())
			.then((responseJson) => {
				if (responseJson == 404) {
					responseJson = [];
				}
				setData(responseJson);
				setDataBackup(responseJson);
			})
			.catch((error) => alert(error))
			.finally(() => setLoading(false));
	}, []);

	return (
		<View style={{ flex: 1 }}>
			{isLoading ? (
				<View
					style={{
						backgroundColor: "white",
						height: "100%",
					}}
				>
					<Text
						style={{
							alignSelf: "center",
							fontSize: 30,
							marginTop: "50%",
							justifyContent: "center",
							fontWeight: "bold",
						}}
					>
						Finding services nearby
					</Text>
					<Image
						source={require("../assets/images/octoloader.gif")}
						style={styles.image}
					/>
				</View>
			) : (
				<SafeAreaView>
					<View
						style={{
							borderRadius: SIZES.medium,
							backgroundColor: "white",
							elevation: 100,

							width: "100%",
							borderColor: COLORS.white,
							borderWidth: 1,
							flexDirection: "row",
							paddingHorizontal: SIZES.font,
							justifyContent: "space-between",
						}}
					>
						<View
							style={{
								backgroundColor: COLORS.white,
							}}
						>
							<View style={{ flexDirection: "row" }}>
								<Image
									source={require("../assets/icons/location.png")}
									resizeMode="contain"
									style={{
										width: 17,
										height: 17,
									}}
								/>
								<Text
									style={{
										fontWeight: "700",
										fontSize: 16,
									}}
								>
									{" "}
									Kothi 103
								</Text>
							</View>
							<Text style={{ fontSize: 12, margin: "1%" }}>
								{" "}
								Phase 9, Mohali
							</Text>
						</View>
						<View
							style={{
								justifyContent: "flex-end",
								flexDirection: "row",
								height: 35,
							}}
						>
							<Image
								source={require("../assets/sqera.png")}
								resizeMode="cover"
								style={{
									alignContent: "center",
									alignSelf: "center",
									width: 70,
									height: 25,
									marginRight: 13,
								}}
							/>

							<TouchableOpacity
								style={{
									marginTop: "1%",
									width: 40,
									height: 10,
								}}
								onPress={() => setModalVisible(true)}
							>
								<Image
									source={assets.menuIcon}
									resizeMode="cover"
									style={{
										alignContent: "center",
										alignSelf: "center",
										width: 48,
										height: 30,
									}}
								/>
							</TouchableOpacity>
						</View>
						<Modal
							animationIn="slideInLeft"
							animationOut="slideOutRight"
							transparent={true}
							visible={modalVisible}
							close={() => {
								toggleModal(false);
							}}
						>
							<Pressable
								style={styles.loweredView}
								onPress={() => {
									setModalVisible(false);
								}}
							>
								<View style={styles.centeredView}>
									<View style={styles.modalView}>
										<ModalList
											setVisible={
												setModalVisible
											}
										/>
									</View>
								</View>
							</Pressable>
						</Modal>
					</View>
					<HomeHeader onSearch={handleSearch} />
					<ScrollView
						style={{
							backgroundColor: COLORS.white,
							marginTop: "2%",
							height: "100%",
							borderRadius: 5,
						}}
					>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								alignContent: "center",
							}}
						>
							<FlatList
								horizontal
								data={data2}
								renderItem={({ item, index }) => (
									<NFTCard1
										key={index}
										data={item}
										index={index}
										setSubSModalVisible={
											setSubSModalVisible
										}
									/>
								)}
								contentContainerStyle={{
									height: "100%",
									alignSelf: "center",
									width: "100%",
									margin: "1%",
								}}
							/>
						</View>

						<View
							style={{
								margin: "3%",
								height: 7,
								width: "100%",
								alignSelf: "center",
								backgroundColor:
									"rgba(244,244,244,244)",
							}}
						/>

						{/* <View
							style={{
								backgroundColor: COLORS.white,
								height: "15%",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<SliderBox
								inactiveDotColor="#90A4AE"
								sliderBoxHeight={300}
								autoplay
								circleLoop
								autoplayInterval={3000}
								height={"100%"}
								width={"90%"}
								opacity={0.8}
								borderRadius={8}
								dotStyle={{
									width: 0,
									height: 0,
									borderRadius: 1,
									marginHorizontal: 0,
									padding: 0,
									backgroundColor:
										"rgba(128, 128, 128, 0.92)",
								}}
								images={[
									"https://img.freepik.com/free-photo/rear-view-programmer-working-all-night-long_1098-18697.jpg?w=2000&t=st=1672688375~exp=1672688975~hmac=8416e203ce399ec68facdf58c3080d1db24be40cc787610e70880e32166d1d9f",
									"https://img.freepik.com/free-photo/housewife-woking-home-lady-blue-shirt-woman-bathroom_1157-45526.jpg?w=2000&t=st=1672688038~exp=1672688638~hmac=d24482e0caf4b75f753a2435569d1c59b940371a9adf3ba4382d8c0d445c8d91",
									"https://img.freepik.com/free-photo/maintenance-repair-works-renovation-concept_343059-3524.jpg?w=2000&t=st=1672688423~exp=1672689023~hmac=23284809561f25ae7ad531b9e57fa8351ab30ab35ce9853ba1abcbb3e8482bb1",
									"https://img.freepik.com/free-photo/hvac-technician-working-capacitor-part-condensing-unit-male-worker-repairman-uniform-repairing-adjusting-conditioning-system-diagnosing-looking-technical-issues_155003-18256.jpg?w=2000&t=st=1672688457~exp=1672689057~hmac=8d5efa29abacc4dc73fef70cf4fbd600751fbb48465853c6b1170639fb45c73b", // Network image
								]}
								// onCurrentImagePressed={(
								// 	index
								// ) =>
								// 	console.log(
								// 		`image ${index} pressed`
								// 	)
								// }
								// currentImageEmitter={(
								// 	index
								// ) =>
								// 	console.log(
								// 		`current pos is: ${index}`
								// 	)
								// }
							/>
						</View>
						<View
							style={{
								margin: "3%",
								height: 7,
								width: "100%",
								alignSelf: "center",
								backgroundColor:
									"rgba(244,244,244,244)",
								borderRadius: 20,
							}}
						/>  */}

						<View style={styles.loweredView}>
							<Modal
								animationType="fade"
								transparent={true}
								visible={subSModalVisible > -1}
								onRequestClose={() => {
									setSubSModalVisible(-1);
								}}
							>
								<TouchableOpacity
									style={styles.loweredView}
									onPressOut={() =>
										setSubSModalVisible(-1)
									}
								>
									<View
										style={[
											styles.modalView,
											{ width: "100%" },
										]}
									>
										<TouchableOpacity
											style={styles.button}
											onPress={() =>
												setSubSModalVisible(
													-1
												)
											}
										>
											<Text> ✖</Text>
										</TouchableOpacity>
										<SubServicesModal
											data={
												data2[
													subSModalVisible
												]
											}
											setSubSModalVisible={
												setSubSModalVisible
											}
										/>
									</View>
								</TouchableOpacity>
							</Modal>
						</View>
					</ScrollView>
				</SafeAreaView>
			)}
		</View>
	);
}

const Tab = createMaterialBottomTabNavigator();
export default function App() {
	{
		/* <ServicesScreen /> */
	}
	return (
		<Tab.Navigator
			initialRouteName="Services"
			screenOptions={{ headerShown: false }}
			barStyle={{ backgroundColor: "white", height: 70 }}
		>
			<Tab.Screen
				name="Services"
				component={ServicesScreen}
				options={{
					tabBarLabel: "",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="account-group-outline"
							color={color}
							size={30}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Search"
				component={Search}
				options={{
					tabBarLabel: "",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="cart"
							color={color}
							size={25}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Bookings"
				component={Bookings}
				options={{
					tabBarLabel: "",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="cart"
							color={color}
							size={25}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 15,
	},
	column: { margin: 3, height: "24%" },
	loweredView: {
		flex: 1,
		justifyContent: "flex-end",
		alignItems: "flex-end",
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
	modalView: {
		backgroundColor: "white",
		borderRadius: 15,
		padding: 1,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: "70%",
		minHeight: "50%",
	},
	ratingbutton: {
		flexDirection: "row",
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		fontSize: 23,
		marginBottom: 15,
		textAlign: "center",
	},
	image: {
		opacity: 0.2,
		width: 500,
		height: 500,
		backgroundColor: "white",
		alignSelf: "center",
		justifyContent: "center",
	},
	image2: {
		opacity: 0.8,
		width: 500,
		height: 400,
		backgroundColor: "white",
	},
	inventoryImage: {
		alignSelf: "center",
		height: 70,
		width: 70,
	},
	container: {
		flex: 1,
	},

	image2: {
		alignSelf: "center",
		height: 100,
		width: 100,
	},
	heading: {
		marginTop: 10,
		margin: 20,
		fontSize: 25,
		fontWeight: "600",
	},
});
