Vue.component('star-rating', VueStarRating.default);

let app = new Vue({
    el: '#app',
    data: {
    max: '',
    image: { url: ""},
    number: '',
    current: {
      title: '',
  
      image: '',
      alt: ''
    },
    loading: true,
    addedName: '',
    addedComment: '',
    comments: {},
    ratings: {},
    },
    created() {
    this.catGen();
    },
    methods: {
        async catGen() {
          try {
            this.loading = true;
            axios.defaults.headers.common['x-api-key'] = "b8a31531-15e5-47fc-88a4-3957adfbfe23";
            let response = await axios.get('https://api.thecatapi.com/v1/images/search', { params: { limit:1, size:"full" } } );
            this.image = response.data[0];
            this.current = response.data[0];
            this.current.image = this.image.url;
            console.log(this.image.url);
            console.log(this.current.number);
            this.loading = false;
            this.number = response.data.num;
          } catch (error) {
            console.log(error);
            this.number = this.max;
          }
        },
        previousCat() {
          this.number = this.current.num - 1;
          if (this.number < 1)
            this.number = 1;
        },
        nextCat() {
          this.number = this.current.num + 1;
          if (this.number > this.max)
            this.number = this.max
        },
        getRandom(min, max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
        },
        randomCat() {
          this.number = this.getRandom(1, this.max);
        },
        addCat() {
          if (!(this.number in this.comments))
            Vue.set(app.comments, this.number, new Array);
          this.comments[this.number].push({
            author: this.addedName,
            text: this.addedComment, 
            date: moment().format('MMMM Do YYYY, h:mm:ss a'),
            
          });
          this.addedName = '';
          this.addedComment = '';
        },
        setRating(rating){
          // Handle the rating
          if (!(this.number in this.ratings))
            Vue.set(this.ratings, this.number, {
              sum: 0,
              total: 0
            });
          this.ratings[this.number].sum += rating;
          this.ratings[this.number].total += 1;
          
        }
    }, 
    computed: {
        month() {
          var month = new Array;
          if (this.current.month === undefined)
            return '';
          month[0] = "January";
          month[1] = "February";
          month[2] = "March";
          month[3] = "April";
          month[4] = "May";
          month[5] = "June";
          month[6] = "July";
          month[7] = "August";
          month[8] = "September";
          month[9] = "October";
          month[10] = "November";
          month[11] = "December";
          return month[this.current.month - 1];
        },
        averageRating(){
          if(this.number in this.ratings){
            let avg = this.ratings[this.number].sum / this.ratings[this.number].total;
            avg *= 10;
            avg = Math.round(avg);
            return avg /= 10;
          }
          else{
            return 0;
          }
            
        },
    },
    watch: {
        number(value, oldvalue) {
          if (oldvalue === '') {
            this.max = value;
          } else {
            this.catGen();
          }
        },
    },
    
});