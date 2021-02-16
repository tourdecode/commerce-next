// import React from 'react'
// import cookies from 'next-cookies'
 
// class NameForm extends React.Component {
//   static async getInitialProps(ctx) {
//     return {
//       initialName: cookies(ctx).name || ''
//     }
//   }
 
//   constructor(props) {
//     super(props);
//     this.state = {name: props.initialName || ''};
//     this.handleChange = this.handleChange.bind(this);
//     this.reset = this.reset.bind(this);
//   }
 
//   handleChange(event) {
//     const newName = event.target.value;
//     this.setState({name: newName});
//     document.cookie = `name=${newName}; path=/`;
//   }
 
//   reset() {
//     this.setState({name: ''});
//     document.cookie = 'name=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
//   }
 
//   render() {
//     return (
//       <div>
//         <p>Hi {this.state.name}</p>
//         <p>Change cookie: <input
//             type="text"
//             placeholder="Your name here"
//             value={this.state.name}
//             onChange={this.handleChange}
//           />!
//         </p>
//         <p>Delete cookie: <button onClick={this.reset}>Reset</button></p>
//       </div>
//     );
//   }
// }
 
// export default NameForm

// posts will be populated at build time by getStaticProps()
// const NameForm = ({ posts }) => {
//   return (
//     <div>
//       <ul>
//         {posts.map((post) => (
//           <li>{post.title}</li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// // This function gets called at build time on server-side.
// // It won't be called on client-side, so you can even do
// // direct database queries. See the "Technical details" section.
// export async function getStaticProps() {
//   // Call an external API endpoint to get posts.
//   // You can use any data fetching library
//   const res = await fetch('https://.../posts')
//   const posts = await res.json()

//   // By returning { props: posts }, the Blog component
//   // will receive `posts` as a prop at build time
//   return {
//     props: {
//       posts,
//     },
//   }
// }

// export default NameForm
