<template>
  <div>
    <div class="board-details" v-if="board">
      <Container
        @drop="onDrop"
        drag-handle-selector=".task-group-title"
        :drop-placeholder="upperDropPlaceholderOptions"
        orientation="horizontal"
      >
        <Draggable v-for="taskGroup in board.taskGroups" :key="taskGroup.id">
          <task-group :taskGroup="taskGroup" @taskDrop="onTaskDrop" />
        </Draggable>
      </Container>
    </div>
  </div>
</template>
 
<script>
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag, generateItems } from "../utils/helpers.js";
import taskGroup from "../components/task-group.cmp.vue";
import AddTask from "../components/add-task.cmp.vue";
export default {
  name: "board-details",
  components: {
    Container,
    Draggable,
    taskGroup,
    AddTask
  },

  data() {
    return {
      /**I dont think we need to have the board in the data you can get it from the store. */
      // board: null,
      upperDropPlaceholderOptions: {
        className: "taskGroup-drop-preview",
        animationDuration: "150",
        showOnTop: true
      }
    };
  },
  async created() {
    let id = "1E3E-1735BF480CA-26A5"; // IN REAL APP WILL COME FROM PARAMS
    await this.$store.dispatch({ type: "getBoardById", id });
  },
  methods: {
    onDrop(dropResult) {
      this.board.taskGroups = applyDrag(this.board.taskGroups, dropResult);
      this.$store.dispatch({ type: "saveBoard", board: this.board });
    },
    async onTaskDrop(taskGroupId, dropResult) {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const board = Object.assign({}, this.board);
        const taskGroup = board.taskGroups.filter(
          taskG => taskG.id === taskGroupId
        )[0];
        const taskGroupIndex = board.taskGroups.indexOf(taskGroup);
        const newTaskGroup = Object.assign({}, taskGroup);
        newTaskGroup.tasks = applyDrag(newTaskGroup.tasks, dropResult);

        // Because Iv'e added ParentlistId to each task to be able to find in what list it's located
        // I had to make sure that the parentListid will change for each task that's why I'm looping
        //over all tasks and chagning their parent
        newTaskGroup.tasks.forEach(task => {
          task.parentListId = newTaskGroup.id;
        });

        board.taskGroups.splice(taskGroupIndex, 1, newTaskGroup);
        await this.$store.dispatch({ type: "saveBoard", board });

        /*I dont think we need this line. I want to get the board from the state
        so the app will update without having to refresh the page */
        // this.board = board;
      }
    }
  },
  components: {
    Container,
    Draggable,
    taskGroup
  },
  computed: {
    board() {
      return this.$store.getters.board;
    }
  }
};
</script>

<style scoped >
</style>