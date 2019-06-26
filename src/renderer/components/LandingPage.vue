<template>
	<div id="app">

		<swipe-list
			ref="list"
			class="card"
			:disabled="!enabled"
			:items="mockSwipeList"
      :key="ids"
			:revealed.sync="revealed"
			:item-disabled="({ disabled }) => disabled"
			@closed="setLastEvent('closed', $event)"
			@leftRevealed="setLastEvent('leftRevealed', $event)"
			@rightRevealed="setLastEvent('rightRevealed', $event)"
		>
			<template v-slot="{ item, index, revealLeft, revealRight, close, revealed }">
				<!-- item is the corresponding object from the array -->
				<!-- index is clearly the index -->
				<!-- revealLeft is method which toggles the left side -->
				<!-- revealRight is method which toggles the right side -->
				<!-- close is method which closes an opened side -->
        <transition-group name="list-complete" tag="p">
				<div ref="content" class="card-content noselect list-complete-item" @click.native="itemClick(item)" :key="item.id">
					<!-- style content how ever you like -->
					<h2>{{ item.title }}</h2>
					<p><b>id:</b> {{ item.id }} <b>description:</b> {{ item.description }} <b>revealed:</b> {{ revealed || 'flase' }}</p>
					<b>index:</b><span> {{ index }}</span>
					<input
						:id="`${index}disabled`"
						v-model="item.disabled"
						type="checkbox"
					>
					<label :for="`${index}disabled`">Disabled</label>
				</div>
        </transition-group>
			</template>
			<!-- left swipe side template and v-slot:left="{ item }" is the item clearly -->
			<!-- remove if you dont wanna have left swipe side  -->
			<template v-slot:left="{ item, close, index }">
				<div class="swipeout-action red" title="remove" @click="remove(item)">
					<!-- place icon here or what ever you want -->
					<i class="fa fa-trash"></i>
				</div>
			</template>
			<!-- right swipe side template and v-slot:right"{ item }" is the item clearly -->
			<!-- remove if you dont wanna have right swipe side  -->
			<template v-slot:right="{ item }">
				<div class="swipeout-action blue">
					<!-- place icon here or what ever you want -->
					<i class="fa fa-heart"></i>
				</div>
			</template>
			<template v-slot:empty>
				<div>
					<!-- change mockSwipeList to an empty array to see this slot in action  -->
					list is empty ( filtered or just empty )
				</div>
			</template>
		</swipe-list>

	</div>
</template>

<script>
	import { SwipeList, SwipeOut } from 'vue-swipe-actions';
	// eslint-disable-next-line no-unused-vars
	export default {
		name: 'App',
		components: {
			SwipeOut,
			SwipeList,
		},
		data() {
			return {
				enabled: true,
				page: 0,
				revealed: {},
				lastEventDescription: '',
        ids: 0,
				mockSwipeList: [
						{
							id: 'a',
							title: 'Some title',
							description: 'some description',
							disabled: false,
						},
						{
							id: 'b',
							title: 'Some title',
							description: 'some description',
							disabled: false,
						},
						{
							id: 'c',
							title: 'Some title',
							description: 'some description',
							disabled: false,
						},
						{
							id: 'd',
							title: 'Some title',
							description: 'some description',
							disabled: false,
						},
						{
							id: 'e',
							title: 'Some title',
							description: 'some description',
							disabled: false,
						},
						{
							id: 'f',
							title: 'Some title',
							description: 'some description',
							disabled: false,
						}
				],
			};
		},
		mounted() {
			// ideally should be in some global handler/store
			window.addEventListener('keydown', this.onKeyDown);
			window.addEventListener('keyup', this.onKeyUp);
		},
		beforeDestroy() {
			window.removeEventListener('keydown', this.onKeyDown);
			window.removeEventListener('keyup', this.onKeyUp);
		},
		methods: {
			dd(v) {
				console.log(v.target);
			},
			revealFirstRight() {
				this.$refs.list.revealRight(0);
			},
			revealFirstLeft() {
				this.$refs.list.revealLeft(0);
			},
			closeFirst() {
				this.$refs.list.closeActions(0);
			},
			closeAll() {
				this.$refs.list.closeActions();
			},
			remove(item) {
				this.mockSwipeList = this.mockSwipeList.filter(i => i !== item);
			},
			setLastEvent(name, { item, index }) {
				this.lastEventDescription = {
					name,
					index,
					id: item.id,
				};
			},
			itemClick(e) {
				console.log(e, 'item click');
			},
			fbClick(e) {
				console.log(e, 'First Button Click');
			},
			sbClick(e) {
				console.log(e, 'Second Button Click');
			},
			// keyboard
			onKeyDown(e) {
				if (e.keyCode !== 16) return;
				this.enabled = false;
			},
			onKeyUp(e) {
				if (e.keyCode !== 16) return;
				this.enabled = true;
			},
		},
	};
</script>
<style>
.list-complete-item {
  transition: all 0.3s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
/* app specific styles */
.swipeout-action {
  display: flex;
  align-items: center;
  padding: 0 3rem;
  cursor: pointer;
  left: 0;
}
/* https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/ */
.swipeout-action.blue {
    color: white;
    background-color: rgb(0, 122, 255);
}
.swipeout-action.blue:hover {
    background-color: darken(rgb(0, 122, 255), 5%);
}
.swipeout-action.purple {
    color: white;
    background-color: rgb(88, 86, 214);
}
.swipeout-action.purple:hover {
    background-color: darken(rgb(88, 86, 214), 5%);
}
.swipeout-action.red {
    color: white;
    background-color: rgb(255, 59, 48);
}
.swipeout-action.red:hover {
    background-color: darken(rgb(255, 59, 48), 5%);
}
.swipeout-action.green {
    color: white;
    background-color: rgb(76, 217, 100);
}
.swipeout-action.green:hover {
	background-color: darken(rgb(76, 217, 100), 5%);
}
.swipeout-list-item {
  flex: 1;
  border-bottom: 1px solid lightgray;
}
.swipeout-list-item:last-of-type {
    border-bottom: none;
}
.card {
  width: 100%;
  background-color: white;
  border-radius: 3px;
  box-shadow: none;
  border: 1px solid lightgray;
}
.card-content {
  padding: 1rem;
}
.transition-right {
	transform: translate3d(100%, 0 ,0) !important;
}
.transition-left {
	transform: translate3d(-100%, 0 ,0) !important;
}
.toolbar {
	display: flex;
	align-items: center;
}
.toolbar .toolbar-section {
	flex: 0 0 auto;
}
.toolbar .toolbar-section--center {
	flex: 1000 1 0%;
}

.swipeout {
	position: relative;
	overflow: hidden;
	display: flex;
}

.swipeout .swipeout-left, .swipeout .swipeout-right {
	position: absolute;
	height: 100%;
	display: flex;
	z-index: 1;
}

.swipeout .swipeout-left {
	left: 0;
	transform: translateX(-100%);
}

.swipeout .swipeout-right {
	right: 0;
	transform: translateX(100%);
}

.swipeout .swipeout-content,
.swipeout .swipeout-action {
	transition: transform .2s;
	will-change: transform;
}

.swipeout.swipeout--no-transition .swipeout-content,
.swipeout.swipeout--no-transition .swipeout-action {
  transition: none !important;
}

.swipeout .swipeout-content {
	width: 100%;
}

.swipeout-non-selectable {
	user-select: none !important;
}

.swipeout-no-pointer-events {
	pointer-events: none !important;
}

/* SwipeList */

.swipeout-list {
	display: flex;
	flex-direction: column;
}

.swipeout-list-item {
	flex: 1;
}
</style>
